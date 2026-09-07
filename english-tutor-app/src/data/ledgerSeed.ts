import type { LearnerLedger } from "../types/ledger";

// Padrões de erro e nível por habilidade transcritos da seção 5 e do perfil funcional
// do relatório "English Tutor Itairan — Semana 0". Serve de baseline para comparação futura.
export const ledgerSeed: LearnerLedger = {
  studentId: "itairan",
  difficulties: [],
  spokenResponses: [],
  errorPatterns: [
    {
      id: "err-concordancia-1",
      category: "concordância",
      example: "the words was",
      correctedForm: "the words were",
      occurrences: 1,
      lastSeenAt: "2026-09-01",
    },
    {
      id: "err-concordancia-2",
      category: "concordância",
      example: "the student need",
      correctedForm: "students need",
      occurrences: 1,
      lastSeenAt: "2026-09-01",
    },
    {
      id: "err-estrutura-1",
      category: "estrutura",
      example: "need understand",
      correctedForm: "need to understand",
      occurrences: 1,
      lastSeenAt: "2026-09-01",
    },
    {
      id: "err-vocabulario-1",
      category: "vocabulário",
      example: "discomfortable",
      correctedForm: "uncomfortable",
      occurrences: 1,
      lastSeenAt: "2026-09-01",
    },
    {
      id: "err-vocabulario-2",
      category: "vocabulário",
      example: "doing your presentation",
      correctedForm: "giving a presentation",
      occurrences: 1,
      lastSeenAt: "2026-09-01",
    },
    {
      id: "err-preposicao-1",
      category: "preposição",
      example: "on this week",
      correctedForm: "this week",
      occurrences: 1,
      lastSeenAt: "2026-09-01",
    },
    {
      id: "err-estrutura-2",
      category: "estrutura",
      example: "because this I accumulated a lot of work",
      correctedForm: "so now I have a lot of work",
      occurrences: 1,
      lastSeenAt: "2026-09-01",
    },
  ],
  recommendations: [
    {
      id: "rec-listening-1",
      reason:
        "Compreensão quebra em frases com 3+ blocos de sentido (padrão identificado no diagnóstico com 'because he was unsure...').",
      relatedSegmentIds: [],
      relatedLessonId: "lesson-listening-ladder-1",
      skillArea: "listening",
      priority: "alta",
      createdAt: "2026-09-01",
    },
    {
      id: "rec-speaking-1",
      reason: "Praticar reparo comunicativo para sustentar conversa acadêmica antes da viagem a Miami.",
      relatedSegmentIds: [],
      relatedLessonId: "lesson-repair-phrases-1",
      skillArea: "speaking",
      priority: "média",
      createdAt: "2026-09-01",
    },
  ],
  skillLevels: {
    listening: 30,
    speaking: 45,
    vocabulary: 70,
    grammar: 60,
  },
};
