// Domínio: quem é o aluno. Separado de course.ts (o que é ensinado) e de ledger.ts
// (o que já aconteceu) — perfil é a foto atual, ledger é o histórico.

import type { SkillArea, SkillLevels } from "./course";

export interface StudentProfile {
  id: string;
  name: string;
  nativeLanguage: string;
  targetLanguage: string;
  shortTermGoal: string;
  goalDate?: string; // ISO date
  priorities: SkillArea[];
  skillLevels: SkillLevels;
  notes?: string;
}
