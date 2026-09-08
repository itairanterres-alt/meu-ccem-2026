import type { Lesson } from "../../types/course";
import type { LearnerLedger } from "../../types/ledger";

interface Props {
  lesson: Lesson;
  ledger: LearnerLedger;
  quizScore: number | null;
  onExit: () => void;
}

/** Fase 5 da sessão padrão: debrief escrito — feedback final (nível 2), não só o imediato. */
export function DebriefStage({ lesson, ledger, quizScore, onExit }: Props) {
  const lessonDifficulties = ledger.difficulties.filter((d) => d.lessonId === lesson.id);
  const lessonResponses = ledger.spokenResponses.filter((r) => r.lessonId === lesson.id);
  const recurringPatterns = ledger.errorPatterns.filter((e) => e.occurrences >= 1).slice(0, 5);
  const relatedRecommendations = ledger.recommendations.filter((r) => r.relatedLessonId === lesson.id);

  return (
    <div className="debrief-stage">
      <h3>Debrief da sessão</h3>

      {quizScore !== null && (
        <p className="debrief-stage__score">
          Prática final: {Math.round(quizScore * 100)}% de acerto.
        </p>
      )}

      <section className="debrief-stage__section">
        <h4>O que travou o listening</h4>
        {lessonDifficulties.length === 0 ? (
          <p className="debrief-stage__empty">Nenhum trecho precisou de ajuda nesta sessão.</p>
        ) : (
          <ul>
            {lessonDifficulties.map((d) => (
              <li key={d.id}>"{d.segmentText}"</li>
            ))}
          </ul>
        )}
      </section>

      <section className="debrief-stage__section">
        <h4>Respostas faladas</h4>
        {lessonResponses.length === 0 ? (
          <p className="debrief-stage__empty">Nenhuma resposta falada registrada nesta sessão.</p>
        ) : (
          <ul>
            {lessonResponses.map((r) => (
              <li key={r.id}>
                "{r.transcript}" — {Math.round(r.score * 100)}%
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="debrief-stage__section">
        <h4>Padrões recorrentes (memória acumulada)</h4>
        <ul>
          {recurringPatterns.map((p) => (
            <li key={p.id}>
              "{p.example}" → "{p.correctedForm}"
            </li>
          ))}
        </ul>
      </section>

      {relatedRecommendations.length > 0 && (
        <section className="debrief-stage__section">
          <h4>Recomendação para a próxima sessão</h4>
          <ul>
            {relatedRecommendations.map((r) => (
              <li key={r.id}>{r.reason}</li>
            ))}
          </ul>
        </section>
      )}

      <button className="btn btn--primary" onClick={onExit}>
        Voltar ao curso
      </button>
    </div>
  );
}
