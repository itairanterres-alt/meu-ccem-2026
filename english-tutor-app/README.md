# English Tutor — Curso Adaptativo (MVP)

Núcleo de um curso personalizado de inglês para falantes de português brasileiro, com
mecanismo de aprendizagem por voz "listening-first": o aluno ouve o trecho em inglês sem
legenda; ao clicar em **"Não compreendi"**, o sistema ativa um modo assistido com legenda
sincronizada, destaque do trecho atual e ferramentas pedagógicas (tradução, vocabulário,
explicação, pronúncia, exemplo, repetição). Cada dificuldade é registrada no **Learner
Ledger**, que alimenta as recomendações de revisão.

Conteúdo inicial (módulo "Fundamentos de Listening" e "Automatização da Fala") é derivado
do relatório-diagnóstico "English Tutor Itairan — Semana 0": foco em segmentação de blocos
falados e reparo comunicativo, com meta funcional de uma visita acadêmica à University of
Miami.

## Rodando localmente

```bash
npm install
npm run dev
```

## Arquitetura

- `src/types/` — contratos TypeScript (curso, ledger, voz, avaliação).
- `src/data/` — dados simulados (perfil do aluno, módulos/lições, ledger inicial).
- `src/voice/` — abstração `VoiceProvider`. `BrowserVoiceProvider` (Nível 1, Web Speech
  API nativa) é a implementação ativa; `RealtimeVoiceProvider` é um stub para uma futura
  API de voz bidirecional em tempo real (ex.: OpenAI Realtime) via backend próprio.
- `src/evaluation/` — abstração `TutorEvaluator`. `PatternEvaluator` avalia localmente
  (palavras-chave + similaridade textual, sem reduzir a "certo/errado"); `LlmEvaluator` é
  um stub para avaliação futura via LLM em backend.
- `src/state/LearnerContext.tsx` — estado global (perfil, progresso, ledger), persistido
  via `state/storage.ts` (hoje `localStorage`, pensado para trocar por Supabase/Postgres
  sem mudar a UI).
- `src/components/lesson-engine/` — o motor de lição reutilizável: listening-first →
  modo assistido sob demanda → prática de fala → mini quiz.
- `src/components/dashboard`, `course`, `ledger` — o "Course Shell": painel, módulos,
  lições, progresso e memória pedagógica.

Esta versão usa dados simulados e voz do navegador (Nível 1). A arquitetura já separa
UI de voz/avaliação por interface, para que autenticação, banco de dados e uma API de
voz bidirecional em tempo real entrem depois sem reescrever componentes.
