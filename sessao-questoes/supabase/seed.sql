-- Seed — piloto 2026/2
-- Dados de teste do fluxo de sessão entram aqui no passo 2.

-- ------------------------------------------------------------------
-- Auth: restringir magic link ao domínio institucional @unidavi.edu.br
-- (todos — alunos e docentes — usam este domínio).
-- Configurar no painel Supabase → Authentication → Providers → Email,
-- ou via política de e-mail; documentado aqui para rastreabilidade.
-- ------------------------------------------------------------------

-- ------------------------------------------------------------------
-- Promoção dos 3 admins nomeados (coordenação/assessoria pedagógica).
-- Rodar após o primeiro login de cada um (magic link cria o profile
-- como 'aluno'; este UPDATE promove a admin).
-- ------------------------------------------------------------------
update public.profiles set role = 'admin'
where email in (
  'itairan.terres@unidavi.edu.br',
  'luiz.zanis@unidavi.edu.br',
  'tatiane.barbosa@unidavi.edu.br'
);
