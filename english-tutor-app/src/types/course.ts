// Domínio: curso, módulos, lições, progresso do aluno.
// Estruturado para futura persistência em Postgres/Supabase (ids estáveis, sem estado embutido em componentes).

export type SkillArea = "listening" | "speaking" | "vocabulary" | "grammar";

export type SkillLevels = Record<SkillArea, number>; // 0-100, estimativa por habilidade

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

export type SegmentHelpKind =
  | "translation"
  | "vocabulary"
  | "explanation"
  | "pronunciation"
  | "example"
  | "repeat";

export interface VocabularyItem {
  term: string;
  translation: string;
  note?: string;
}

export interface LessonSegment {
  id: string;
  /** Texto em inglês do trecho (usado para TTS e para a legenda sincronizada). */
  text: string;
  /** Tradução de referência do trecho inteiro. */
  translation: string;
  /** Explicação simples da ideia do trecho, em português. */
  explanation: string;
  /** Pronúncia aproximada (transliteração simples, não IPA), para leitura rápida em PT-BR. */
  pronunciationHint: string;
  /** Exemplo adicional relacionado ao trecho. */
  example: string;
  vocabulary: VocabularyItem[];
  /** Palavras-chave/estruturas esperadas quando o trecho é usado em prática de fala. */
  expectedKeywords?: string[];
}

export type LessonKind = "listening-core" | "speaking-practice" | "review";

export interface MiniQuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  relatedSegmentId?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  kind: LessonKind;
  cefrLevel: "A2" | "B1" | "B2";
  segments: LessonSegment[];
  quiz: MiniQuizQuestion[];
  estimatedMinutes: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessonIds: string[];
}

export interface LessonProgress {
  lessonId: string;
  status: "not-started" | "in-progress" | "completed";
  attempts: number;
  lastAttemptAt?: string; // ISO datetime
  segmentsNeedingReview: string[]; // segment ids marcados "não compreendi"
  quizScore?: number; // 0-1
}

export interface CourseProgress {
  studentId: string;
  moduleProgress: Record<string, { completedLessonIds: string[] }>;
  lessonProgress: Record<string, LessonProgress>;
  overallCompletionPercent: number;
}
