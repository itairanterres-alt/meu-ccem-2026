import type { Module } from "../../types/course";
import { lessons } from "../../data/courseCatalog";
import { useLearner } from "../../state/LearnerContext";

interface Props {
  module: Module;
  onSelectLesson: (lessonId: string) => void;
  onBack: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  "not-started": "Não iniciada",
  "in-progress": "Em andamento",
  completed: "Concluída",
};

export function LessonList({ module, onSelectLesson, onBack }: Props) {
  const { progress } = useLearner();

  return (
    <div className="lesson-list">
      <button className="btn btn--ghost btn--small" onClick={onBack}>
        ← Módulos
      </button>
      <h2>{module.title}</h2>
      <p>{module.description}</p>

      <ul className="lesson-list__items">
        {module.lessonIds.map((lessonId) => {
          const lesson = lessons[lessonId];
          const status = progress.lessonProgress[lessonId]?.status ?? "not-started";
          if (!lesson) return null;
          return (
            <li key={lessonId} className="lesson-list__item">
              <button onClick={() => onSelectLesson(lessonId)}>
                <div>
                  <h4>{lesson.title}</h4>
                  <p>{lesson.description}</p>
                  <span className="lesson-list__meta">
                    {lesson.cefrLevel} · {lesson.estimatedMinutes} min
                  </span>
                </div>
                <span className={`status-pill status-pill--${status}`}>{STATUS_LABEL[status]}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
