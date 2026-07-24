# Passo 2 — Fluxo da sessão de ponta a ponta

Scaffold Vite + React + TS + Tailwind (IBM Plex Sans, tokens UNIDAVI) com o fluxo completo:
professor monta e abre → aluno entra pelo código → professor abre item → aluno responde →
professor trava → distribuição aparece (professor, projeção e aluno) → avança → encerra.

## Como rodar

```bash
cd sessao-questoes
npm install
npm run dev       # http://localhost:5173, modo demo por padrão
```

Sem `.env`, cai automaticamente em **modo demo**: dados em memória, sem Supabase. Abra
`/#/professor` numa aba e `/#/aluno` em outra(s) — o estado é sincronizado entre abas do
mesmo navegador via `localStorage` + evento `storage` (ver `src/lib/demoClient.ts`).

Para produção, copie `.env.example` para `.env`, defina `VITE_DATA_MODE=supabase` +
`VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`. Nenhuma tela muda — ambos os modos
implementam a mesma interface `SessaoClient` (`src/lib/api.ts`).

## Decisão de arquitetura: dois clientes, uma interface

`SessaoClient` (`src/lib/api.ts`) é o contrato único que as telas conhecem. Duas implementações:

- **`demoClient.ts`** — em memória, réplica fiel das regras de negócio do schema (uma
  resposta por aluno/imutável, gabarito nunca visível com item aberto, alternativas
  embaralhadas por item, distribuição só após travar). Não é mock burro: é a mesma
  mecânica que as RPCs terão em produção, funcionando como especificação executável.
  Usa as **40 questões reais** da amostra (`src/lib/questoes-seed.ts`, gerado de
  `docs/anexos/UC1_fase4_canonico.json`).
- **`supabaseClient.ts`** — chama as RPCs reais (`rpc_entrar_sessao`, `rpc_ver_item`,
  `rpc_responder`, `rpc_distribuicao`, `rpc_contagem_respostas`, `rpc_contagem_participantes`)
  via `supabase-js`. Não testado contra projeto ao vivo (nenhum provisionado ainda) — a
  fidelidade ao schema foi validada no smoke test em Postgres local.

`src/lib/client.ts` escolhe qual implementação injetar via `VITE_DATA_MODE`.

## Migration 5 — gap descoberto construindo a UI

`supabase/migrations/20260724100400_contagem_participantes.sql` adiciona `rpc_contagem_participantes`.
Faltava no schema aprovado: a tela de projeção precisa mostrar "N conectados" enquanto a
sessão está `aberta` e nenhum item foi aberto ainda (`questao_atual` é null) — e
`rpc_contagem_respostas` exige um `sessao_questao_id`, que só existe depois do primeiro
"avançar". Aditiva, não toca nada aprovado; validada com o mesmo processo de smoke test
das migrations 1–4 (Postgres 16 local, shim do ambiente Supabase).

## Identidade — ainda não é a feature `auth/`

`src/lib/identity.ts` faz as vezes de autenticação no modo demo: personas fixas
(`PROFESSOR_DEMO`, `alunoDemo(n)`) guardadas em `sessionStorage` (não `localStorage`) —
de propósito, para que cada aba do navegador possa ser um aluno diferente. A feature
`auth/` real (magic link + `profiles`) é trabalho futuro; quando existir, só
`identity.ts` muda — as telas já consomem uma identidade abstrata.

## Verificação

Rodado de ponta a ponta com Playwright contra o build de produção (`vite preview`),
2 páginas simultâneas (professor + aluno; limite observado do ambiente sandboxed —
3+ páginas Chromium concorrentes travam por limitação do container, não do app; a
tela de projeção foi validada isoladamente e também integrada, fechando o mesmo
professor/aluno antes de abri-la). Confirmado visualmente:

- Alternativas embaralhadas por item (ordem de exibição ≠ ordem canônica A,B,C,D)
- Gabarito e `correta` nunca aparecem com o item `aberta`
- "Justificativa geral" do .docx aparece corretamente dobrada na alternativa correta
- Aviso "não compõe nota" fixo na tela do aluno
- Distribuição consistente entre professor, projeção e resultado do aluno
- `npm run build` e `tsc -b --noEmit` limpos

## O que falta para o piloto (fora do escopo deste passo)

- Feature `auth/` real (magic link Supabase, restrito a `@unidavi.edu.br`)
- Importação (Porta A/B, passo 3)
- Dashboards e cards (passo 4)
- Projeto Supabase provisionado e `supabaseClient.ts` testado ao vivo
- Cobertura de OAs (§8) — depende da fonte importável de SP/OA (ver `docs/revisao-schema.md`)
