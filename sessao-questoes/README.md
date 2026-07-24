# Sessão Semanal de Questões — Medicina UNIDAVI

App enxuto para a sessão semanal de ~20 questões ENAMED em sala: professor projeta, turma responde pelo celular, sistema trava, mostra distribuição, professor discute. Formativo, sem nota. Piloto 2026/2 com T15, T14 e T13.

Fatia do ecossistema MED-UNIDAVI 2027 — o que precisa nascer certo é o **schema de dados** (`supabase/migrations/`).

## Estado atual

**Passo 1 de 4** (conforme plano de trabalho): estrutura + migrations para revisão do schema. **Nenhuma UI ainda** — o schema deve ser aprovado antes.

O schema foi **realinhado ao contrato institucional** `schema_questao_med_unidavi.json` (o `SCHEMA_OUTPUT` da §10, encontrado dentro da skill `capi-questoes-enamed`) — que prevalece sobre o rascunho da §5. As 40 questões reais da amostra foram carregadas no formato canônico e o fluxo inteiro revalidado sob RLS.

Leia `docs/revisao-schema.md`: a reconciliação com o SCHEMA_OUTPUT, as decisões, o que foi resolvido pelo coordenador e as perguntas em aberto. Fontes de verdade curriculares em `docs/anexos/schema-institucional/`.

## Stack (fechada)

React + Vite + TypeScript · Tailwind · Supabase `sa-east-1` com RLS · magic link (e-mail institucional) · Supabase Realtime · Vercel · Anthropic API (só estruturação de texto colado na importação).

## Estrutura de pastas proposta

```
sessao-questoes/
├── README.md
├── docs/
│   └── revisao-schema.md        # decisões e perguntas em aberto
├── supabase/
│   ├── migrations/
│   │   ├── 20260724100000_schema_inicial.sql      # tipos e tabelas
│   │   ├── 20260724100100_funcoes_triggers.sql    # versão, código, profile
│   │   ├── 20260724100200_rls.sql                 # políticas
│   │   └── 20260724100300_rpcs_realtime.sql       # mecânica da sessão
│   └── seed.sql                 # dados de teste (passo 2)
│
│  # ——— criado após aprovação do schema (passos 2–4) ———
├── index.html
├── vite.config.ts / tsconfig / tailwind
└── src/
    ├── lib/                     # cliente supabase, tipos gerados, helpers
    ├── ui/                      # componentes base (tokens UNIDAVI)
    └── features/
        ├── auth/                # magic link, sessão persistente
        ├── sessao-professor/    # criar, montar, conduzir (abrir/avançar/travar/encerrar)
        ├── projecao/            # tela projetada: código, item, distribuição
        ├── sessao-aluno/        # entrar por código, responder, revisão
        ├── importacao/          # Porta A (CSV/JSON) e Porta B (colar + IA + conferência)
        ├── dashboards/          # professor/admin (agregados) e aluno (próprio)
        └── cards/               # flashcards FSRS do aluno
```

Racional: organização por *feature* (não por tipo de arquivo) porque cada perfil usa um recorte distinto do app; quando o módulo for absorvido pelo ecossistema 2027, cada pasta de `features/` é uma unidade transplantável. `projecao/` separada de `sessao-professor/` porque são duas telas com critérios opostos (legibilidade da última fileira × controle do condutor) que podem rodar em janelas diferentes.

Deploy: projeto Vercel próprio com *root directory* `sessao-questoes/` (este repositório hospeda também o app CCEM na raiz).

## Como aplicar as migrations

```bash
supabase link --project-ref <ref-do-projeto>   # projeto em sa-east-1
supabase db push
```

Depois de aprovar o schema: gerar tipos com `supabase gen types typescript` para `src/lib/database.types.ts`.

## Ordem de trabalho combinada

1. ✅ Estrutura + migrations (este commit) — **aguardando revisão do schema**
2. Fluxo da sessão de ponta a ponta com dados de teste
3. Importação (Porta A: CSV/JSON no `SCHEMA_OUTPUT`; Porta B: colar + estruturar + conferir)
4. Dashboards e cards
