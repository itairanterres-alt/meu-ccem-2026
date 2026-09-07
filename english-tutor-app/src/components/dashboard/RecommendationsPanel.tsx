import type { ReviewRecommendation } from "../../types/ledger";

interface Props {
  recommendations: ReviewRecommendation[];
  onOpenLesson?: (lessonId: string) => void;
}

const PRIORITY_ORDER: Record<ReviewRecommendation["priority"], number> = { alta: 0, média: 1, baixa: 2 };

export function RecommendationsPanel({ recommendations, onOpenLesson }: Props) {
  const sorted = [...recommendations].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );

  return (
    <section className="card recommendations-panel">
      <h3>Recomendações de revisão</h3>
      {sorted.length === 0 && <p className="recommendations-panel__empty">Sem recomendações pendentes.</p>}
      <ul>
        {sorted.map((rec) => (
          <li key={rec.id} className={`recommendations-panel__item priority-${rec.priority}`}>
            <span className="recommendations-panel__badge">{rec.priority}</span>
            <div>
              <p>{rec.reason}</p>
              {rec.relatedLessonId && (
                <button
                  className="btn btn--ghost btn--small"
                  onClick={() => onOpenLesson?.(rec.relatedLessonId!)}
                >
                  Praticar agora →
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
