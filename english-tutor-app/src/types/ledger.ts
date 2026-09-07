// Learner Ledger: memória pedagógica do aluno dentro do artefato.
// Nesta versão é persistido em localStorage (ver state/storage.ts), mas o formato
// já é o que seria salvo em banco (linha por evento, sem estado derivado embutido).

import type { SkillArea, SkillLevels, SegmentHelpKind } from "./course";

export type AssistanceRequestType = SegmentHelpKind;

export interface DifficultyRecord {
  id: string;
  lessonId: string;
  segmentId: string;
  segmentText: string;
  /** O que foi pedido de ajuda para este trecho (pode pedir mais de um tipo). */
  helpRequested: AssistanceRequestType[];
  /** Palavras específicas apontadas/derivadas como difíceis dentro do trecho. */
  hardWords: string[];
  /** Velocidade de reprodução usada quando a dificuldade ocorreu (1 = normal). */
  playbackRate: number;
  createdAt: string; // ISO datetime
}

export interface SpokenResponseRecord {
  id: string;
  lessonId: string;
  segmentId: string;
  prompt: string;
  /** Transcrição obtida via VoiceProvider (ou digitada, no fallback sem reconhecimento de voz). */
  transcript: string;
  evaluationSummary: string;
  matchedKeywords: string[];
  missedKeywords: string[];
  score: number; // 0-1
  createdAt: string;
}

export interface ErrorPattern {
  id: string;
  category: "concordância" | "preposição" | "vocabulário" | "estrutura" | "pronúncia" | "outro";
  example: string;
  correctedForm: string;
  occurrences: number;
  lastSeenAt: string;
}

export interface ReviewRecommendation {
  id: string;
  reason: string;
  relatedSegmentIds: string[];
  relatedLessonId?: string;
  skillArea: SkillArea;
  priority: "alta" | "média" | "baixa";
  createdAt: string;
}

export interface LearnerLedger {
  studentId: string;
  difficulties: DifficultyRecord[];
  spokenResponses: SpokenResponseRecord[];
  errorPatterns: ErrorPattern[];
  recommendations: ReviewRecommendation[];
  skillLevels: SkillLevels;
}
