-- ============================================================
-- Migration 4/4: RPCs da mecânica da sessão + Realtime
--
-- Por que RPCs security definer em vez de acesso direto:
--   * rpc_entrar_sessao  — aluno não precisa (nem deve) listar sessões
--                          abertas; o código é a chave de entrada.
--   * rpc_ver_item       — entrega a questão SEM gabarito/justificativa
--                          enquanto o item está aberto (RLS é por linha,
--                          não por coluna).
--   * rpc_responder      — valida estado 'aberta' no servidor; resposta
--                          fora de janela não entra.
--   * rpc_distribuicao   — só contagens por alternativa, nunca linhas
--                          individuais; é o que a projeção mostra.
--   * rpc_contagem_respostas — "N de M responderam", para o professor
--                          decidir quando travar (sem ver distribuição
--                          antes de travar).
-- ============================================================

-- ---------- Aluno entra pelo código ----------

create or replace function public.rpc_entrar_sessao(p_codigo text)
returns jsonb
language plpgsql security definer
set search_path = public
as $$
declare
  s public.sessoes%rowtype;
begin
  if auth.uid() is null then
    raise exception 'Não autenticado';
  end if;

  select * into s
  from public.sessoes
  where codigo = upper(trim(p_codigo))
    and status in ('aberta', 'em_andamento');

  if not found then
    raise exception 'Sessão não encontrada ou não está aberta';
  end if;

  insert into public.sessao_participantes (sessao_id, aluno_id)
  values (s.id, auth.uid())
  on conflict do nothing;

  return jsonb_build_object(
    'sessao_id', s.id,
    'titulo', s.titulo,
    'status', s.status,
    'questao_atual', s.questao_atual
  );
end;
$$;

-- ---------- Aluno vê o item (gabarito-safe) ----------

create or replace function public.rpc_ver_item(p_sessao_questao_id uuid)
returns jsonb
language plpgsql stable security definer
set search_path = public
as $$
declare
  sq public.sessao_questoes%rowtype;
  q  public.questoes%rowtype;
  r  public.respostas%rowtype;
  pode boolean;
  resultado jsonb;
begin
  select * into sq from public.sessao_questoes where id = p_sessao_questao_id;
  if not found then
    raise exception 'Item não encontrado';
  end if;

  select (
    exists (select 1 from public.sessao_participantes p
            where p.sessao_id = sq.sessao_id and p.aluno_id = auth.uid())
    or exists (select 1 from public.sessoes s
               where s.id = sq.sessao_id and s.professor_id = auth.uid())
    or public.fn_is_admin()
  ) into pode;

  if not pode then
    raise exception 'Sem acesso a este item';
  end if;

  if sq.estado = 'aguardando' then
    raise exception 'Item ainda não foi aberto';
  end if;

  select * into q from public.questoes where id = sq.questao_id;

  resultado := jsonb_build_object(
    'sessao_questao_id', sq.id,
    'estado', sq.estado,
    'ordem', sq.ordem,
    'enunciado', q.enunciado,
    'vinheta', q.vinheta,
    'alt_a', q.alt_a,
    'alt_b', q.alt_b,
    'alt_c', q.alt_c,
    'alt_d', q.alt_d
  );

  select * into r
  from public.respostas
  where sessao_id = sq.sessao_id
    and questao_id = sq.questao_id
    and aluno_id = auth.uid();

  if found then
    resultado := resultado || jsonb_build_object('minha_resposta', r.alternativa);
  end if;

  -- gabarito e justificativas só depois do travamento
  if sq.estado in ('travada', 'discutida') then
    resultado := resultado || jsonb_build_object(
      'gabarito', q.gabarito,
      'just_a', q.just_a,
      'just_b', q.just_b,
      'just_c', q.just_c,
      'just_d', q.just_d,
      'acertei', (r.alternativa is not null and r.alternativa = q.gabarito)
    );
  end if;

  return resultado;
end;
$$;

-- ---------- Aluno responde ----------

create or replace function public.rpc_responder(p_sessao_questao_id uuid, p_alternativa text)
returns void
language plpgsql security definer
set search_path = public
as $$
declare
  sq public.sessao_questoes%rowtype;
  st public.sessao_status;
begin
  if auth.uid() is null then
    raise exception 'Não autenticado';
  end if;

  if upper(trim(p_alternativa)) not in ('A', 'B', 'C', 'D') then
    raise exception 'Alternativa inválida';
  end if;

  select * into sq from public.sessao_questoes where id = p_sessao_questao_id;
  if not found then
    raise exception 'Item não encontrado';
  end if;

  select status into st from public.sessoes where id = sq.sessao_id;

  if st <> 'em_andamento' or sq.estado <> 'aberta' then
    raise exception 'Este item não está aberto para respostas';
  end if;

  if not exists (
    select 1 from public.sessao_participantes p
    where p.sessao_id = sq.sessao_id and p.aluno_id = auth.uid()
  ) then
    raise exception 'Você não entrou nesta sessão';
  end if;

  begin
    insert into public.respostas (sessao_id, questao_id, aluno_id, alternativa)
    values (sq.sessao_id, sq.questao_id, auth.uid(), upper(trim(p_alternativa)));
  exception when unique_violation then
    raise exception 'Resposta já registrada — não é possível alterar';
  end;
end;
$$;

-- ---------- Distribuição por alternativa (projeção) ----------
-- Retorna as quatro alternativas com contagem (zero incluído).
-- Disponível apenas com o item travado/discutido — nunca antes.

create or replace function public.rpc_distribuicao(p_sessao_questao_id uuid)
returns table (alternativa text, contagem bigint)
language plpgsql stable security definer
set search_path = public
as $$
declare
  sq public.sessao_questoes%rowtype;
  pode boolean;
begin
  select * into sq from public.sessao_questoes where id = p_sessao_questao_id;
  if not found then
    raise exception 'Item não encontrado';
  end if;

  select (
    exists (select 1 from public.sessoes s
            where s.id = sq.sessao_id and s.professor_id = auth.uid())
    or public.fn_is_admin()
    or exists (select 1 from public.sessao_participantes p
               where p.sessao_id = sq.sessao_id and p.aluno_id = auth.uid())
  ) into pode;

  if not pode then
    raise exception 'Sem acesso a este item';
  end if;

  if sq.estado not in ('travada', 'discutida') then
    raise exception 'Distribuição disponível apenas após travar o item';
  end if;

  return query
  select alt.a, count(r.id)
  from (values ('A'), ('B'), ('C'), ('D')) as alt (a)
  left join public.respostas r
    on r.sessao_id = sq.sessao_id
   and r.questao_id = sq.questao_id
   and r.alternativa = alt.a
  group by alt.a
  order by alt.a;
end;
$$;

-- ---------- "N de M responderam" (professor, item aberto) ----------

create or replace function public.rpc_contagem_respostas(p_sessao_questao_id uuid)
returns jsonb
language plpgsql stable security definer
set search_path = public
as $$
declare
  sq public.sessao_questoes%rowtype;
  n_respostas bigint;
  n_conectados bigint;
begin
  select * into sq from public.sessao_questoes where id = p_sessao_questao_id;
  if not found then
    raise exception 'Item não encontrado';
  end if;

  if not (
    exists (select 1 from public.sessoes s
            where s.id = sq.sessao_id and s.professor_id = auth.uid())
    or public.fn_is_admin()
  ) then
    raise exception 'Apenas o professor da sessão';
  end if;

  select count(*) into n_respostas
  from public.respostas
  where sessao_id = sq.sessao_id and questao_id = sq.questao_id;

  select count(*) into n_conectados
  from public.sessao_participantes
  where sessao_id = sq.sessao_id;

  return jsonb_build_object('respostas', n_respostas, 'conectados', n_conectados);
end;
$$;

-- ---------- Realtime ----------
-- Clientes (aluno e projeção) assinam mudanças de sessoes e
-- sessao_questoes para acompanhar o lockstep. postgres_changes
-- respeita RLS, então o aluno só recebe eventos das sessões em
-- que é participante.

alter publication supabase_realtime add table public.sessoes;
alter publication supabase_realtime add table public.sessao_questoes;
