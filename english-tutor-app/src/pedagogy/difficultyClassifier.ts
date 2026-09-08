import type { SkillArea } from "../types/course";
import type { DifficultyRecord, SpokenResponseRecord } from "../types/ledger";

export type DifficultySeverity = "leve" | "moderada" | "alta";

/**
 * Classifica a severidade de uma dificuldade de listening a partir de quantos tipos de
 * ajuda o aluno precisou e da velocidade em que ainda travou. Não reduz a "entendeu/não
 * entendeu" — várias camadas de ajuda em velocidade normal pesam mais que uma única ajuda
 * em velocidade reduzida.
 */
export function classifyListeningDifficulty(record: DifficultyRecord): DifficultySeverity {
  const helpCount = new Set(record.helpRequested).size;
  if (helpCount >= 3 && record.playbackRate >= 1) return "alta";
  if (helpCount >= 2) return "moderada";
  return "leve";
}

/**
 * Classifica uma resposta falada a partir do score do TutorEvaluator. Mantém a lógica de
 * corte num único lugar, para que UI e recomendações concordem sobre o que é "fraco".
 */
export function classifySpeakingResponse(response: SpokenResponseRecord): DifficultySeverity {
  if (response.score >= 0.7) return "leve";
  if (response.score >= 0.4) return "moderada";
  return "alta";
}

export function skillAreaForDifficulty(_record: DifficultyRecord): SkillArea {
  return "listening";
}

export function skillAreaForSpokenResponse(_response: SpokenResponseRecord): SkillArea {
  return "speaking";
}
