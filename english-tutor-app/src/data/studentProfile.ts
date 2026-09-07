import type { StudentProfile } from "../types/course";

// Baseline do relatório "English Tutor Itairan — Semana 0".
// Perfil assimétrico: leitura/vocabulário passivo fortes, listening é o gargalo principal.
export const studentProfile: StudentProfile = {
  id: "itairan",
  name: "Itairan",
  nativeLanguage: "pt-BR",
  targetLanguage: "en-US",
  shortTermGoal: "Visita acadêmica à University of Miami (simulação clínica)",
  goalDate: "2026-10-20",
  priorities: ["listening", "speaking"],
  skillLevels: {
    listening: 30,
    speaking: 45,
    vocabulary: 70,
    grammar: 60,
  },
  notes:
    "Gramática consciente e vocabulário passivo (especialmente médico/acadêmico) muito acima do desempenho oral em tempo real. Tradução mental palavra-a-palavra aumenta a carga cognitiva no listening.",
};
