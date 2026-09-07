import type { CourseProgress, Module } from "../../types/course";
import { lessons } from "../../data/modules";

interface Props {
  progress: CourseProgress;
  modules: Module[];
}

export function ProgressOverview({ progress, modules }: Props) {
  const totalLessons = modules.reduce((sum, m) => sum + m.lessonIds.length, 0);
  const completedLessons = Object.values(progress.lessonProgress).filter(
    (lp) => lp.status === "completed"
  ).length;

  return (
    <section className="card progress-overview">
      <h3>Progresso do curso</h3>
      <div className="progress-overview__bar">
        <div className="progress-overview__fill" style={{ width: `${progress.overallCompletionPercent}%` }} />
      </div>
      <p className="progress-overview__summary">
        {completedLessons} de {totalLessons} lições concluídas ({progress.overallCompletionPercent}%)
      </p>

      <ul className="progress-overview__list">
        {Object.values(progress.lessonProgress).map((lp) => (
          <li key={lp.lessonId}>
            <span className={`status-dot status-dot--${lp.status}`} />
            {lessons[lp.lessonId]?.title ?? lp.lessonId}
            {lp.segmentsNeedingReview.length > 0 && (
              <span className="progress-overview__review-count">
                {lp.segmentsNeedingReview.length} trecho(s) para revisar
              </span>
            )}
          </li>
        ))}
        {Object.keys(progress.lessonProgress).length === 0 && (
          <li className="progress-overview__empty">Nenhuma lição iniciada ainda.</li>
        )}
      </ul>
    </section>
  );
}
