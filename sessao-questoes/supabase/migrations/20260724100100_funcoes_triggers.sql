-- ============================================================
-- Migration 2/4: funções auxiliares e triggers
-- ============================================================

-- ---------- Papel do usuário logado ----------
-- security definer: roda como owner e ignora RLS de profiles,
-- evitando recursão nas policies.

create or replace function public.fn_role()
returns public.user_role
language sql stable security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.fn_is_staff()
returns boolean
language sql stable
set search_path = public
as $$
  select public.fn_role() in ('professor', 'admin')
$$;

create or replace function public.fn_is_admin()
returns boolean
language sql stable
set search_path = public
as $$
  select public.fn_role() = 'admin'
$$;

-- ---------- Predicados de sessão para RLS ----------
-- security definer para quebrar a recursão entre as policies de
-- `sessoes` e `sessao_participantes` (uma referencia a outra) e para
-- que policies de outras tabelas consultem estas sem depender das
-- policies delas.

create or replace function public.fn_conduz_sessao(p_sessao_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.sessoes
    where id = p_sessao_id and professor_id = auth.uid()
  )
$$;

create or replace function public.fn_participa_da_sessao(p_sessao_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.sessao_participantes
    where sessao_id = p_sessao_id and aluno_id = auth.uid()
  )
$$;

-- Aluno pode ler a questão completa (com gabarito) quando participou
-- de uma sessão em que o item já foi travado/discutido.
create or replace function public.fn_questao_liberada_para_aluno(p_questao_id uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.sessao_questoes sq
    join public.sessao_participantes p on p.sessao_id = sq.sessao_id
    where sq.questao_id = p_questao_id
      and p.aluno_id = auth.uid()
      and sq.estado in ('travada', 'discutida')
  )
$$;

-- ---------- Criação automática de profile no signup ----------
-- Magic link cria o auth.user; este trigger espelha em profiles.
-- Todo mundo nasce 'aluno'; admin promove professor/admin depois.

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, nome)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'nome', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Proteção de role/email em profiles ----------
-- Aluno/professor podem editar o próprio nome/turma/fase,
-- mas só admin altera role ou email. auth.uid() null = service
-- role / SQL editor, que passa livre (seed de admins).

create or replace function public.trg_profile_protegido()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;
  if not public.fn_is_admin()
     and (new.role is distinct from old.role
          or new.email is distinct from old.email) then
    raise exception 'Apenas admin pode alterar role ou email';
  end if;
  return new;
end;
$$;

create trigger profile_protegido
  before update on public.profiles
  for each row execute function public.trg_profile_protegido();

-- ---------- Versionamento de questões ----------
-- Edição de CONTEÚDO grava o snapshot da versão anterior (linha +
-- alternativas) em questao_versoes e incrementa `versao`. Mudança só de
-- status (pendente <-> curado) não gera versão.
--
-- As alternativas vivem em questao_alternativas, mas o documento canônico
-- completo (incl. o array `alternativas`) é mantido em `payload`. Comparar
-- os campos de conteúdo projetados + payload->'alternativas' cobre também
-- edição de alternativa, desde que o editor/importador mantenha o payload
-- em sincronia (o que a Porta A/B fazem por construção).

create or replace function public.fn_snapshot_questao(p_id uuid)
returns jsonb
language sql stable security definer
set search_path = public
as $$
  select jsonb_build_object(
    'questao', to_jsonb(q),
    'alternativas', coalesce(
      (select jsonb_agg(to_jsonb(a) order by a.letra)
       from public.questao_alternativas a where a.questao_id = q.id), '[]'::jsonb)
  )
  from public.questoes q where q.id = p_id
$$;

create or replace function public.trg_questao_versionar()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if (old.enunciado, old.texto_base, old.tema, old.subtema,
      old.uc_slug, old.sp_referencia, old.area_clinica, old.nivel_bloom,
      old.dificuldade_editorial, old.competencia_dcn_2025, old.oa_slugs,
      old.tags, old.referencia, old.fase_alvo,
      old.payload -> 'alternativas')
     is distinct from
     (new.enunciado, new.texto_base, new.tema, new.subtema,
      new.uc_slug, new.sp_referencia, new.area_clinica, new.nivel_bloom,
      new.dificuldade_editorial, new.competencia_dcn_2025, new.oa_slugs,
      new.tags, new.referencia, new.fase_alvo,
      new.payload -> 'alternativas') then
    insert into public.questao_versoes (questao_id, versao, snapshot, editado_por)
    values (old.id, old.versao, public.fn_snapshot_questao(old.id), auth.uid());
    new.versao := old.versao + 1;
    -- edição de conteúdo devolve a questão à curadoria
    new.status := 'pendente';
  end if;
  new.atualizado_em := now();
  return new;
end;
$$;

create trigger questao_versionar
  before update on public.questoes
  for each row execute function public.trg_questao_versionar();

-- ---------- Código da sessão ----------
-- 6 caracteres, alfabeto sem ambiguidade de projeção/leitura de longe
-- (sem I, L, O, 0, 1). security definer: a checagem de unicidade
-- precisa enxergar TODAS as sessões, não só as visíveis pela RLS.

create or replace function public.fn_gerar_codigo()
returns text
language plpgsql security definer
set search_path = public
as $$
declare
  alfabeto constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  cod text;
begin
  loop
    cod := '';
    for i in 1..6 loop
      cod := cod || substr(alfabeto, 1 + floor(random() * length(alfabeto))::int, 1);
    end loop;
    exit when not exists (select 1 from public.sessoes where codigo = cod);
  end loop;
  return cod;
end;
$$;

create or replace function public.trg_sessao_codigo()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.codigo is null or new.codigo = '' then
    new.codigo := public.fn_gerar_codigo();
  end if;
  return new;
end;
$$;

create trigger sessao_codigo
  before insert on public.sessoes
  for each row execute function public.trg_sessao_codigo();
