-- ============================================================
-- Migration 5: rpc_contagem_participantes
--
-- Gap descoberto construindo a tela de projeção (passo 2, §7): "Tela de
-- projeção mostra o código enquanto os alunos entram; contador de
-- conectados." rpc_contagem_respostas (migration 4) exige um
-- sessao_questao_id — não serve enquanto a sessão está 'aberta' e nenhum
-- item foi aberto ainda (questao_atual é null). Falta o contador cru de
-- sessao_participantes por sessão. Aditiva; não altera nada aprovado.
-- ============================================================

create or replace function public.rpc_contagem_participantes(p_sessao_id uuid)
returns int
language plpgsql stable security definer
set search_path = public
as $$
declare
  n int;
begin
  if not (
    public.fn_conduz_sessao(p_sessao_id)
    or public.fn_is_admin()
    or public.fn_participa_da_sessao(p_sessao_id)
  ) then
    raise exception 'Sem acesso a esta sessão';
  end if;

  select count(*) into n from public.sessao_participantes where sessao_id = p_sessao_id;
  return n;
end;
$$;
