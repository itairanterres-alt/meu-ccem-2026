-- ============================================================
-- Migration 3/4: Row Level Security
--
-- Invariantes (não negociáveis, §5 do brief):
--   * Aluno lê apenas as próprias respostas e os próprios cards.
--   * Resposta individual nunca é exposta a outro aluno, nem ao
--     professor durante a sessão — professor só vê agregados (RPCs).
--   * Aluno só enxerga gabarito/justificativas depois do item travado
--     (durante 'aberta' o item chega via RPC que omite o gabarito).
-- ============================================================

alter table public.profiles             enable row level security;
alter table public.questoes             enable row level security;
alter table public.questao_versoes      enable row level security;
alter table public.sessoes              enable row level security;
alter table public.sessao_questoes      enable row level security;
alter table public.sessao_participantes enable row level security;
alter table public.respostas            enable row level security;
alter table public.cards                enable row level security;

-- ---------- profiles ----------

create policy "proprio ou staff le"
  on public.profiles for select
  using (id = auth.uid() or public.fn_is_staff());

-- role/email protegidos pelo trigger profile_protegido
create policy "proprio edita"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "admin edita qualquer"
  on public.profiles for update
  using (public.fn_is_admin())
  with check (public.fn_is_admin());

-- sem insert (trigger handle_new_user) e sem delete (remover professor = mudar role)

-- ---------- questoes ----------

create policy "staff le banco"
  on public.questoes for select
  using (public.fn_is_staff());

-- aluno lê a questão completa (com gabarito e justificativas) apenas
-- quando participou de uma sessão em que o item já foi travado
create policy "aluno le pos travamento"
  on public.questoes for select
  using (public.fn_questao_liberada_para_aluno(id));

create policy "staff importa"
  on public.questoes for insert
  with check (public.fn_is_staff() and criado_por = auth.uid());

-- edição gera versão via trigger; curadoria (status) também passa aqui
create policy "staff edita"
  on public.questoes for update
  using (public.fn_is_staff())
  with check (public.fn_is_staff());

-- governança: professor cria e cura; admin exclui
create policy "admin exclui"
  on public.questoes for delete
  using (public.fn_is_admin());

-- ---------- questao_versoes ----------

create policy "staff le versoes"
  on public.questao_versoes for select
  using (public.fn_is_staff());

-- escrita apenas via trigger security definer

-- ---------- sessoes ----------

-- fn_participa_da_sessao é security definer justamente para esta policy
-- não recursar na policy de sessao_participantes (que aponta de volta
-- para sessoes via fn_conduz_sessao)
create policy "professor dono, admin ou participante le"
  on public.sessoes for select
  using (
    professor_id = auth.uid()
    or public.fn_is_admin()
    or public.fn_participa_da_sessao(id)
  );

create policy "staff cria propria sessao"
  on public.sessoes for insert
  with check (public.fn_is_staff() and professor_id = auth.uid());

create policy "professor conduz propria sessao"
  on public.sessoes for update
  using (professor_id = auth.uid() or public.fn_is_admin())
  with check (professor_id = auth.uid() or public.fn_is_admin());

create policy "professor apaga rascunho proprio"
  on public.sessoes for delete
  using ((professor_id = auth.uid() and status = 'rascunho') or public.fn_is_admin());

-- ---------- sessao_questoes ----------
-- A linha em si não expõe conteúdo da questão (o conteúdo é protegido
-- pela RLS de `questoes` + RPC); aluno participante pode ver estado/ordem
-- para acompanhar o lockstep via Realtime.

create policy "dono admin ou participante le itens"
  on public.sessao_questoes for select
  using (
    public.fn_conduz_sessao(sessao_id)
    or public.fn_is_admin()
    or public.fn_participa_da_sessao(sessao_id)
  );

create policy "dono monta sessao"
  on public.sessao_questoes for insert
  with check (public.fn_conduz_sessao(sessao_id) or public.fn_is_admin());

create policy "dono reordena e conduz"
  on public.sessao_questoes for update
  using (public.fn_conduz_sessao(sessao_id) or public.fn_is_admin())
  with check (public.fn_conduz_sessao(sessao_id) or public.fn_is_admin());

create policy "dono remove item"
  on public.sessao_questoes for delete
  using (public.fn_conduz_sessao(sessao_id) or public.fn_is_admin());

-- ---------- sessao_participantes ----------

create policy "proprio dono ou admin le participantes"
  on public.sessao_participantes for select
  using (
    aluno_id = auth.uid()
    or public.fn_is_admin()
    or public.fn_conduz_sessao(sessao_id)
  );

-- insert apenas via rpc_entrar_sessao (security definer)

-- ---------- respostas ----------
-- Invariante central: aluno lê APENAS as próprias respostas; admin lê tudo;
-- professor NÃO tem select direto — enxerga agregados via RPC.

create policy "aluno le proprias respostas"
  on public.respostas for select
  using (aluno_id = auth.uid());

create policy "admin le respostas"
  on public.respostas for select
  using (public.fn_is_admin());

-- insert apenas via rpc_responder (security definer);
-- sem update/delete: resposta é imutável após envio

-- ---------- cards ----------
-- Só o aluno acessa os próprios cards, e só pode criar card de questão
-- que ele mesmo respondeu em alguma sessão.

create policy "aluno le proprios cards"
  on public.cards for select
  using (aluno_id = auth.uid());

create policy "aluno cria card de questao respondida"
  on public.cards for insert
  with check (
    aluno_id = auth.uid()
    and exists (
      select 1 from public.respostas r
      where r.aluno_id = auth.uid() and r.questao_id = cards.questao_id
    )
  );

create policy "aluno revisa proprios cards"
  on public.cards for update
  using (aluno_id = auth.uid())
  with check (aluno_id = auth.uid());

create policy "aluno apaga proprios cards"
  on public.cards for delete
  using (aluno_id = auth.uid());
