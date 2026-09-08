# English Tutor — Curso Adaptativo (MVP)

Núcleo de um curso personalizado de inglês acadêmico/clínico para falantes de português
brasileiro, com sessão padrão de aula (warm-up → Listening Ladder → speaking practice →
consolidation → debrief) e mecanismo de aprendizagem por voz "listening-first": o aluno
ouve o trecho em inglês sem legenda; ao clicar em **"Não compreendi"**, o sistema ativa uma
intervenção pedagógica por etapas — repetir → segmentar em blocos → explicar som/significado
→ reconstruir a frase → voltar à frase original — em vez de só mostrar a legenda de uma vez.

Conteúdo inicial deriva do relatório-diagnóstico "English Tutor Itairan — Semana 0": o
gargalo é listening (segmentação de blocos falados em velocidade normal), speaking é
funcional mas pouco automatizado, e o objetivo funcional é uma visita acadêmica à
University of Miami (centro de simulação clínica, palestras, interação com professores).
A trilha "Acadêmica e Clínica" cobre esses cenários — não hotel/restaurante genérico.

Feedback em duas camadas: imediato (1-2 correções logo após a resposta falada, formato
"Good. Two changes: ... Now continue.", sem travar o fluxo) e final (debrief escrito ao fim
da sessão, com padrões recorrentes e recomendações). O **Learner Ledger** registra cada
dificuldade e resposta falada; a camada `pedagogy/` transforma isso em recomendações de
revisão — não é player de áudio com legenda, é um tutor adaptativo.

## Rodando localmente

```bash
npm install
npm run dev
```

## Arquitetura

- `src/types/` — contratos TypeScript: `course.ts` (catálogo), `learner.ts` (perfil do
  aluno), `ledger.ts` (memória/histórico), `session.ts` (fases da sessão padrão), `voice.ts`,
  `evaluation.ts`. Conteúdo do curso nunca importa de `learner`/`ledger` — "aula" e
  "histórico do aluno" ficam separados de propósito.
- `src/content/lessons/` — conteúdo pedagógico de cada lição (Listening Ladder, trilha
  acadêmica/clínica, Repair Phrases). `src/data/courseCatalog.ts` só agrupa em módulos.
- `src/data/` — dados simulados: `studentProfileSeed.ts`, `ledgerSeed.ts`,
  `sessionConfig.ts` (prompts de warm-up/consolidation), `courseCatalog.ts`.
- `src/voice/` — abstração `VoiceProvider` (em `types/voice.ts`) + `voiceSupport.ts`
  (ponto único de escolha do provider). `voice/providers/BrowserVoiceProvider.ts` (Nível 1,
  Web Speech API nativa) é a implementação ativa; `RealtimeVoiceProvider.stub.ts` fixa o
  contrato para uma futura API de voz bidirecional em tempo real via backend próprio.
- `src/evaluation/` — abstração `TutorEvaluator`. `PatternEvaluator` avalia localmente
  (palavras-chave + similaridade textual, sem reduzir a "certo/errado"); `LlmEvaluator.stub.ts`
  fixa o contrato para avaliação futura via LLM em backend.
- `src/pedagogy/` — a camada que decide o que fazer com uma dificuldade: `difficultyClassifier`
  (severidade), `recommendationEngine` (Learner Ledger → recomendações, recalculado a cada
  mudança), `reviewScheduler` (prioridade/próxima lição), `lessonAdaptation` (sequência de
  intervenção do modo assistido + feedback imediato de duas camadas).
- `src/lesson-runtime/` — máquina de estados da sessão: `lessonSessionReducer.ts` (puro,
  testável) + `useLessonSession.ts` (conecta aos efeitos colaterais: ledger, voz, avaliação)
  + `segmentTiming.ts`/`lessonEvents.ts`. `LessonEngine.tsx` só renderiza o que o hook expõe.
- `src/state/LearnerContext.tsx` — estado global (perfil, progresso, ledger). A persistência
  é injetada via `storageProviderFactory` (padrão: `localStorageProviderFactory` em
  `state/storage.ts`) — o contexto nunca importa localStorage diretamente, então trocar para
  Supabase/Postgres é só passar outra factory em `<LearnerProvider>`.
- `src/components/lesson-engine/` — estágios da sessão: `WarmupStage`, `ListeningStage`,
  `AssistedStage` (intervenção por etapas), `SpeakingPractice`, `ConsolidationStage`,
  `MiniQuiz`, `DebriefStage`.
- `src/components/dashboard`, `course`, `ledger` — o "Course Shell": painel, módulos,
  lições, progresso e memória pedagógica.

Esta versão usa dados simulados e voz do navegador (Nível 1). A arquitetura já separa
UI de voz/avaliação/persistência por interface, para que autenticação, banco de dados e uma
API de voz bidirecional em tempo real entrem depois sem reescrever componentes.
