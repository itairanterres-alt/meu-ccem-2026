import type { LearnerLedger, ReviewRecommendation } from "../types/ledger";
import { classifyListeningDifficulty, classifySpeakingResponse } from "./difficultyClassifier";

let counter = 0;
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

/**
 * Gera recomendações de revisão a partir do estado atual do Learner Ledger. É o coração
 * da adaptação: transforma "o aluno não entendeu X" em "praticar X de novo, com esta
 * prioridade". Determinístico e puro — sem side effects, fácil de testar.
 */
export function generateRecommendations(ledger: LearnerLedger): ReviewRecommendation[] {
  const recommendations: ReviewRecommendation[] = [];
  const now = new Date().toISOString();

  // Dificuldades de listening agrupadas por lição: 2+ trechos com dificuldade na mesma
  // lição indicam que vale revisar a lição inteira, não só o trecho isolado.
  const difficultiesByLesson = new Map<string, typeof ledger.difficulties>();
  for (const d of ledger.difficulties) {
    const list = difficultiesByLesson.get(d.lessonId) ?? [];
    list.push(d);
    difficultiesByLesson.set(d.lessonId, list);
  }

  for (const [lessonId, records] of difficultiesByLesson) {
    const highSeverityCount = records.filter((r) => classifyListeningDifficulty(r) === "alta").length;
    if (records.length === 0) continue;
    recommendations.push({
      id: nextId("rec-listening"),
      reason:
        records.length >= 2
          ? `${records.length} trechos com dificuldade nesta lição — revisar em velocidade reduzida antes de avançar.`
          : `Trecho "${records[0].segmentText}" precisou de ajuda — repetir antes da próxima sessão.`,
      relatedSegmentIds: records.map((r) => r.segmentId),
      relatedLessonId: lessonId,
      skillArea: "listening",
      priority: highSeverityCount >= 1 || records.length >= 2 ? "alta" : "média",
      createdAt: now,
    });
  }

  // Respostas de fala fracas: recomendar reforço de speaking, priorizando frases de reparo.
  const weakSpoken = ledger.spokenResponses.filter((r) => classifySpeakingResponse(r) !== "leve");
  if (weakSpoken.length > 0) {
    recommendations.push({
      id: nextId("rec-speaking"),
      reason: `${weakSpoken.length} resposta(s) falada(s) abaixo do esperado — praticar reconstrução de frase e reparo comunicativo.`,
      relatedSegmentIds: weakSpoken.map((r) => r.segmentId),
      relatedLessonId: "lesson-repair-phrases-1",
      skillArea: "speaking",
      priority: weakSpoken.length >= 2 ? "alta" : "média",
      createdAt: now,
    });
  }

  // Padrões de erro recorrentes (2+ ocorrências): vira recomendação de gramática.
  const recurring = ledger.errorPatterns.filter((e) => e.occurrences >= 2);
  if (recurring.length > 0) {
    recommendations.push({
      id: nextId("rec-grammar"),
      reason: `Padrões recorrentes: ${recurring.map((e) => `"${e.example}" → "${e.correctedForm}"`).join("; ")}.`,
      relatedSegmentIds: [],
      skillArea: "grammar",
      priority: "média",
      createdAt: now,
    });
  }

  // Sem nenhum sinal ainda: mantém ao menos a prioridade estrutural do diagnóstico
  // (listening é o gargalo nº 1), para o painel nunca ficar vazio na primeira visita.
  if (recommendations.length === 0) {
    recommendations.push({
      id: nextId("rec-baseline"),
      reason: "Comece pelo Listening Ladder — é o gargalo identificado como prioridade nº 1 no diagnóstico.",
      relatedSegmentIds: [],
      relatedLessonId: "lesson-listening-ladder-1",
      skillArea: "listening",
      priority: "alta",
      createdAt: now,
    });
  }

  return recommendations;
}
