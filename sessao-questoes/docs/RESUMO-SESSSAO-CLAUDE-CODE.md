# Resumo da Sessão Claude Code — Produção Handoff

**Data:** 2026-08-18  
**Branch:** `claude/unidavi-question-sessions-1jd2xn`  
**Commits:** 5 últimos (veja `git log --oneline -5`)

## O que foi feito

### 1. **Integração de 519 questões das 5ª e 6ª fases** ✅
   - Parseador `parseColado.ts` reutilizado em script Node para processar 52 arquivos (26 SPs × Questões+Gabarito)
   - **839 questões reais** agora no banco de teste (`questoes-seed.ts`)
   - Validação: 4 alternativas, exatamente 1 correta, sem campos vazios
   - Teste Playwright confirmado: fase 4 (280), fase 5 (280), fase 6 (279)

### 2. **Feature de autenticação por magic link** ✅
   - `src/features/auth/AuthContext.tsx` — provedor único de identidade
   - `src/features/auth/Login.tsx` — tela de magic link institucional
   - `src/features/auth/guards.tsx` — `RequireStaff` e `RequireAuth` para proteção de rotas
   - `src/lib/supabaseAuth.ts` — ponte supabase.auth → identidade + role
   - Modo demo preservado: personas em `sessionStorage`, sem atrito de desenvolvimento
   - Modo supabase: magic link + profiles com roles (professor/admin/aluno)
   - Build passa, smoke test OK

### 3. **Script de carga das questões** ✅
   - `scripts/seed-questoes.ts` — carrega as 839 questões em `questoes + questao_alternativas`
   - Roda com `npm run seed:questoes` (exige service role + uuid admin)
   - Idempotente: aborta se tabela já tem linhas, ou força com `SEED_FORCE=1`

### 4. **Documentação** ✅
   - `docs/producao-handoff.md` — 5 passos até a sala, decisões, armadilhas (6 aprendidas)
   - `docs/passo-c-tipificacao.md` — guia passo-a-passo para tipar `supabaseClient.ts` com `database.types.ts`
   - Roadmap atualizado mostrando dependências

## Estado atual

| Passo | Nome | Status |
|-------|------|--------|
| A | Provisionar Supabase | ⬜ [precisa do dono] |
| B | Feature de autenticação | ✅ FEITO |
| C.1 | Tipificação de `database.types.ts` | 📋 Guia pronto |
| C.2 | Script de carga de questões | ✅ FEITO |
| C.3 | `.env` local e teste ao vivo | ⬜ [depende de A] |
| D | Deploy Vercel | ⬜ [precisa do dono] |
| E | Ensaio com celulares reais | ⬜ [depende de A] |

## Próximo passo imediato para o Cowork

**Passo A — Provisionar Supabase:**
1. Criar projeto em `sa-east-1` (São Paulo)
2. Copiar Project URL e anon key
3. Rodar `supabase link --project-ref <ref>` e `supabase db push` (aplica 5 migrations)
4. Rodar `supabase/seed.sql` (admins + domínio)
5. Habilitar magic link em Authentication, restringir a `@unidavi.edu.br`

**Depois, em paralelo:**
- Agente roda Passo C.1/C.3 (tipificação e teste local)
- Dono faz Passo D (deploy Vercel) e Passo E (ensaio)

## Comandos úteis

```bash
# Modo demo (padrão)
npm run dev

# Modo Supabase (após Passo A)
VITE_DATA_MODE=supabase \
VITE_SUPABASE_URL=https://<ref>.supabase.co \
VITE_SUPABASE_ANON_KEY=<key> \
npm run dev

# Carregar 839 questões no Supabase (após Passo A + admin login)
SUPABASE_URL=https://<ref>.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<service_role_key> \
SEED_AUTOR_ID=<uuid_admin> \
npm run seed:questoes

# Gerar tipos do banco
supabase gen types typescript --project-id <ref> > src/lib/database.types.ts

# Build + typecheck
npm run build
npx tsc -b --noEmit
```

## Armadilhas documentadas

1. Nomes de arquivo não indicam fase — sempre conferir cabeçalho do documento
2. Numeração de UC rotacionada na 4ª fase (já acomodado)
3. SP1 de "Problemas Mentais" tem só 19 questões (dado da fonte)
4. Questões discursivas descartadas (schema atual só suporta A-D)
5. Limite ~2 páginas Chromium simultâneas em testes
6. **Magic link × HashRouter** — flowType PKCE, emailRedirectTo sem hash
7. **Singleton Supabase** — auth e RPCs na MESMA instância

## Verificações finais

- ✅ `npm run build` passa
- ✅ `npx tsc -b --noEmit` limpo
- ✅ Playwright smoke test (fases 4/5/6, contagem correta)
- ✅ Todos os commits pusheados para `origin/claude/unidavi-question-sessions-1jd2xn`
- ✅ Working tree limpo

**Próximo agente pode começar com Passo A (Supabase) ou C.1/C.3 (tipificação + teste) — nenhum bloqueador local.**
