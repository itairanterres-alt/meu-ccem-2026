import type { SessionConfig } from "../types/session";

// Estrutura de sessão padrão do relatório: warm-up oral (perguntas sobre trabalho,
// medicina, viagem) e consolidation reaproveitando estruturas que apareceram na aula.
export const defaultSessionConfig: SessionConfig = {
  warmupPrompts: [
    {
      id: "warmup-1",
      promptEn: "How was your day today?",
      promptPt: "Como foi o seu dia hoje?",
    },
    {
      id: "warmup-2",
      promptEn: "What did you work on this week?",
      promptPt: "No que você trabalhou esta semana?",
    },
    {
      id: "warmup-3",
      promptEn: "Are you looking forward to the trip to Miami?",
      promptPt: "Você está animado com a viagem a Miami?",
    },
  ],
  consolidation: [
    {
      id: "cons-1",
      structureEn: "Could you say that again a little more slowly?",
      note: "Reutilize esta estrutura sempre que precisar de tempo para reorganizar a fala.",
    },
    {
      id: "cons-2",
      structureEn: "One of the students asked a question because...",
      note: "Bloco 'one of the students' + motivo — útil para descrever situações acadêmicas.",
    },
  ],
};
