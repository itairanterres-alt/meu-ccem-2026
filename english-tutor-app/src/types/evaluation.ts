// Avaliação da fala/resposta do aluno. Não reduz a "certo/errado":
// devolve keywords batidas/perdidas, um resumo qualitativo e uma pontuação contínua.

import type { LessonSegment } from "./course";

export interface EvaluationInput {
  segment: LessonSegment;
  transcript: string;
  /** Contexto opcional: pergunta feita ao aluno, se diferente do texto do trecho. */
  prompt?: string;
}

export interface EvaluationResult {
  score: number; // 0-1, contínuo — nunca só booleano
  matchedKeywords: string[];
  missedKeywords: string[];
  /** Resumo qualitativo em português, para o aluno entender o que mudar. */
  summary: string;
  /** Sugestão de correção pontual, quando aplicável (estilo "feedback imediato" do relatório). */
  suggestedCorrection?: string;
}

export interface TutorEvaluator {
  readonly id: string;
  evaluate(input: EvaluationInput): Promise<EvaluationResult>;
}
