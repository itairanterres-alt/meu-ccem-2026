# Handoff — levar o app à sala de aula (produção)

Documento de transferência para quem for continuar (humano ou agente, incluindo o Cowork rodando
na máquina do Itairan). Contém: estado atual, o que falta em ordem, comandos exatos, decisões já
tomadas e armadilhas aprendidas. O que está **fora** deste doc já está feito e commitado.

## Como usar este handoff (para um agente como o Cowork)

1. Clonar o repo `itairanterres-alt/meu-ccem-2026`, branch `claude/unidavi-question-sessions-1jd2xn`.
2. O app está em `sessao-questoes/` (a raiz do repo hospeda também o app CCEM).
3. Ler, nesta ordem: `README.md`, `docs/passo-2-fluxo-sessao.md`, `docs/passo-3-importacao.md`,
   `docs/revisao-schema.md`, e este arquivo.
4. Seguir os passos abaixo. Os passos marcados **[precisa do dono]** exigem login nas contas do
   Itairan (Supabase, Vercel) — ele faz o login; o agente conduz e usa as CLIs já autenticadas na
   máquina dele.

## Estado atual (o que já funciona)

- App React + Vite + TS + Tailwind. Roda em **modo demo** (`npm run dev` em `sessao-questoes/`),
  dados em memória + `localStorage`, sem backend.
- Fluxo da sessão de ponta a ponta pronto e verificado (professor monta/abre → aluno entra por
  código → responde → professor trava → distribuição → avança → encerra) — passo 2.
- Importação Porta A (JSON) e Porta B (colar do formato ENAMED) prontas — passo 3.
- **839 questões reais** no banco de teste (`src/lib/questoes-seed.ts`): 4ª, 5ª e 6ª fases (3 UCs
  PBL de cada). Detalhe por UC/SP em `docs/passo-3-importacao.md`.
- Migrations do schema completas e validadas em Postgres local (`supabase/migrations/`, 5
  arquivos): tipos/tabelas, funções/triggers, RLS, RPCs/realtime, contagem de participantes.
- `supabase/seed.sql`: admins reais + domínio institucional.
- Dois clientes com a mesma interface (`src/lib/api.ts`): `demoClient.ts` (demo) e
  `supabaseClient.ts` (produção). `src/lib/client.ts` escolhe por `VITE_DATA_MODE`.

## O PONTO CRÍTICO: por que o demo não serve para a sala

O modo demo sincroniza via `localStorage`, que só é compartilhado entre abas do **mesmo navegador
na mesma máquina**. Na sala, professor e alunos estão em **dispositivos diferentes** — não
enxergam esse `localStorage`. Logo, a sala **exige** o backend Supabase real (servidor
compartilhado + Realtime). O demo foi andaime de desenvolvimento; produção é obrigatória para o
piloto.

## Passos até a sala de aula

### Passo A — provisionar o Supabase **[precisa do dono]**

1. Criar projeto Supabase na região `sa-east-1` (São Paulo — menor latência para SC).
2. Guardar: **Project URL** e **anon key** (Settings → API). São os dois valores que o app precisa.
3. Aplicar o schema (a partir de `sessao-questoes/`):
   ```bash
   supabase link --project-ref <ref-do-projeto>
   supabase db push        # aplica as 5 migrations
   ```
4. Rodar o seed (admins + domínio): aplicar `supabase/seed.sql` (via `psql` na connection string do
   projeto, ou colando no SQL Editor do painel).
5. No painel **Authentication**: habilitar login por **magic link** (e-mail) e restringir ao
   domínio `@unidavi.edu.br`. (Decisão já tomada — ver `docs/revisao-schema.md`.)

### Passo B — feature de autenticação **✅ FEITO (código)**

Construída a feature `src/features/auth/` (magic link real por cima do schema existente). O que foi
entregue:
- **`AuthContext.tsx`** — provedor único (`useAuth()`) que as telas consomem no lugar dos acessos
  diretos a `identity.ts`. Expõe `{ identidade, carregando, modo, entrarComoDemo, enviarMagicLink,
  sair }`. Em modo demo, a identidade vem de `identity.ts` (personas em `sessionStorage`, uma aba =
  um usuário — preservado); em modo supabase, vem de `supabase.auth` + a linha em `profiles`.
- **`Login.tsx`** — tela de magic link institucional (valida `@unidavi.edu.br`, sem senha).
- **`guards.tsx`** — `RequireStaff` (professor/admin) e `RequireAuth` (autenticado); aplicados em
  `App.tsx`. A `/projecao/:id` fica sem guarda de propósito (tela de sala, sem login próprio). No
  modo demo os guards não criam atrito (o professor "entra" como `PROFESSOR_DEMO` ao abrir a área).
- **`src/lib/supabaseAuth.ts`** — ponte `supabase.auth` → `Identidade` (resolve role via `profiles`,
  dispara/encerra sessão, assina `onAuthStateChange`).
- As telas (`Home`, `ProfessorHome`, `NovaSessao`, `ProfessorConduzir`, `PortaA/B`, `AlunoEntrar`,
  `AlunoSessao`) agora leem a identidade de `useAuth()`; nenhuma importa mais `PROFESSOR_DEMO`/
  `lerIdentidade` direto (exceto o próprio provedor/guard, por construção).
- **`identity.ts`**: `Identidade.role` passou a incluir `'admin'`; adicionado `ehStaff()`.
- **`supabaseClient.ts`**: `criarSupabaseClient()` agora é **singleton** (a auth e as RPCs precisam
  compartilhar a MESMA instância, senão as chamadas sairiam sem o JWT). Configurado `flowType:
  'pkce'` — ver a armadilha nova nº 6 sobre HashRouter.

Verificado: `npm run build` (tsc + vite) passa; smoke test em modo demo (Home → professor → nova
sessão) roda sem erros de runtime. **Não testado contra Supabase ao vivo** (projeto ainda não
provisionado) — o Passo A continua sendo o gate.

### Passo C — ligar o app ao Supabase **[código]**

1. Gerar os tipos do banco e trocar os `as any` em `supabaseClient.ts`:
   ```bash
   supabase gen types typescript --project-id <ref> > src/lib/database.types.ts
   ```
   Depois, tipar as chamadas RPC/tabela em `supabaseClient.ts` com os tipos gerados.
2. Carregar as 839 questões no banco real. **Script pronto (opção a):** `scripts/seed-questoes.ts`,
   rodável com `npm run seed:questoes`. Insere `questoes-seed.ts` em `questoes` +
   `questao_alternativas` com o payload canônico completo. Exige três variáveis de ambiente:
   ```bash
   SUPABASE_URL=https://<ref>.supabase.co \
   SUPABASE_SERVICE_ROLE_KEY=<service_role key> \
   SEED_AUTOR_ID=<uuid do profile admin> \
   npm run seed:questoes
   ```
   Usa a **service role** (bypassa RLS — é carga administrativa) e aborta se `questoes` já tiver
   linhas (use `SEED_FORCE=1` para forçar). O `SEED_AUTOR_ID` é o `id` de um admin em `profiles` —
   ou seja, o admin precisa ter feito o 1º login (magic link) antes, para o trigger `handle_new_user`
   ter criado a linha. Descubra com `select id, email from public.profiles where role='admin';`.
   A opção (b) — usar a própria importação (Porta A/B), que em modo `supabase` grava direto no banco
   (RLS "staff importa") — continua válida, mas a (a) é mais rápida para a carga inicial.
3. Configurar o `.env` local para teste ao vivo (ver `.env.example`):
   ```
   VITE_DATA_MODE=supabase
   VITE_SUPABASE_URL=<project url>
   VITE_SUPABASE_ANON_KEY=<anon key>
   ```
   Rodar `npm run dev` e testar o fluxo real (professor numa aba/dispositivo, aluno em outro).

### Passo D — publicar na Vercel **[precisa do dono]**

1. Projeto Vercel novo apontando para este repo, com **Root Directory = `sessao-questoes/`**.
2. Variáveis de ambiente no painel da Vercel: `VITE_DATA_MODE=supabase`, `VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`.
3. Deploy. Vira um link `https://<algo>.vercel.app` que os alunos abrem no celular.

### Passo E — ensaio antes da aula **[dono + agente]**

Teste com 2-3 celulares reais (professor + alunos) contra a produção, antes da turma real, para
pegar atrito de rede/Realtime que o demo não expõe.

## Decisões já tomadas (não reabrir sem motivo)

- Stack fechada: React+Vite+TS · Tailwind · Supabase `sa-east-1` com RLS · magic link
  (`@unidavi.edu.br`) · Supabase Realtime · Vercel.
- Tipografia IBM Plex Sans; tokens visuais UNIDAVI (`docs/anexos/tokens-unidavi.*`).
- Contrato canônico da questão: `docs/anexos/schema-institucional/schema_questao_med_unidavi.json`
  (o SCHEMA_OUTPUT prevalece). Schema do app já realinhado — ver `docs/revisao-schema.md`.
- Admins e domínio institucional em `supabase/seed.sql`.
- Atividade **formativa, não compõe nota** — aviso fixo na tela do aluno.

## Armadilhas aprendidas (custaram tempo — não repetir)

1. **Nome de arquivo NÃO indica a fase.** Cada fase tem sua própria UC1/UC2/UC3 com temas
   diferentes; um "UC1 SP2 Questoes.docx" pode ser Proliferação Celular (4ª) ou Dor (5ª). Sempre
   conferir o cabeçalho interno do documento (`Unidade Curricular … — <nome>`) antes de processar.
2. **Numeração de UC do banco de OAs da skill está com rotação errada na 4ª fase**
   (`oas_med_unidavi_2026_1.json`): os SPs de proliferação celular estão rotulados `uc02` quando
   deveriam ser `uc01`, etc. A taxonomia (`taxonomia_med_unidavi_2026_1.json`) é que está certa.
   Por isso `sp_referencia` fica `null` nas questões importadas — não é seguro derivar SP desse
   banco até a coordenação corrigir na fonte. Ver `docs/revisao-schema.md` e `docs/anexos/README.md`.
3. **Uma SP veio incompleta na fonte:** "Problemas Mentais e de Comportamento" (6ª fase) SP1
   ("Memórias") tem só 19 questões nos .docx originais (não existe QUESTÃO 20). Por isso essa UC
   tem 79 e não 80. Se a Q20 aparecer, é só acrescentar.
4. **Questões discursivas ficam de fora** do schema atual (`alternativas` A-D é obrigatório). Havia
   13 arquivos discursivos na pasta; descartados por decisão do coordenador.
5. **Limite de ~2 páginas Chromium simultâneas** no ambiente de teste sandboxed — para testes
   Playwright multi-dispositivo, reusar/fechar páginas em vez de abrir muitas de uma vez.
6. **Magic link × HashRouter.** O app usa `HashRouter` (rotas no `#`). O fluxo *implicit* do
   Supabase devolve o token também no fragmento (`#access_token=…`), o que colide com as rotas. Por
   isso o cliente foi configurado com `flowType: 'pkce'` (`supabaseClient.ts`): o retorno vem em
   `?code=…` na query string e o `detectSessionInUrl` troca por sessão no carregamento. **Ao testar
   ao vivo, confirmar que o retorno do e-mail estabelece a sessão** (é o único ponto que não deu
   para validar sem projeto Supabase). Se der problema, a alternativa é migrar para `BrowserRouter`
   com rewrite na Vercel. O `emailRedirectTo` é `origin + pathname` (sem hash) — garantir que essa
   URL esteja na allowlist de **Redirect URLs** no painel Supabase (Authentication → URL
   Configuration), incluindo a URL final da Vercel.
7. **`criarSupabaseClient()` é singleton** — não instanciar um segundo cliente para auth. Se auth e
   RPCs usarem instâncias diferentes, o JWT não acompanha as chamadas e tudo cai em "não
   autenticado". Ver a nota no topo de `supabaseClient.ts`.

## Roadmap combinado (onde estamos)

1. ✅ Estrutura + migrations
2. ✅ Fluxo da sessão de ponta a ponta
3. ✅ Importação (Porta A/B) + carga das 4ª/5ª/6ª fases (839 questões)
4. ⏳ **Produção: Supabase provisionado + auth + deploy Vercel** ← este handoff
   - ✅ Passo B — feature de autenticação (magic link) construída e buildando
   - ✅ Passo C.2 — script de carga das 839 questões pronto (`npm run seed:questoes`)
   - ✅ Passo C.1 — guia de tipificação (`docs/passo-c-tipificacao.md`)
   - ⬜ Passo A — provisionar Supabase **[precisa do dono]** (gate de tudo abaixo)
   - ⬜ Passo C.1 exec — gerar `database.types.ts`, tipar `supabaseClient.ts` **[código, depende de Passo A]**
   - ⬜ Passo C.3 — `.env` local e teste ao vivo **[agente + dono, depende de Passo A]**
   - ⬜ Passo D — deploy Vercel **[precisa do dono]**
   - ⬜ Passo E — ensaio com celulares reais **[dono + agente]**
5. ⬜ Dashboards e cards (professor/admin/aluno; curadoria; flashcards FSRS)
