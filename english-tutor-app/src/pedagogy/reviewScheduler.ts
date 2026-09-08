import type { ReviewRecommendation } from "../types/ledger";

const PRIORITY_WEIGHT: Record<ReviewRecommendation["priority"], number> = { alta: 0, média: 1, baixa: 2 };

/** Ordena recomendações por prioridade e, dentro da mesma prioridade, pelas mais recentes. */
export function sortRecommendations(recommendations: ReviewRecommendation[]): ReviewRecommendation[] {
  return [...recommendations].sort((a, b) => {
    const byPriority = PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
    if (byPriority !== 0) return byPriority;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/** Escolhe a próxima lição sugerida (para "praticar agora" no dashboard). */
export function pickNextLessonId(recommendations: ReviewRecommendation[]): string | null {
  const sorted = sortRecommendations(recommendations);
  return sorted.find((r) => r.relatedLessonId)?.relatedLessonId ?? null;
}
