import type { Module } from "../../types/course";
import { useLearner } from "../../state/LearnerContext";

interface Props {
  modules: Module[];
  onSelectModule: (moduleId: string) => void;
}

export function ModuleList({ modules, onSelectModule }: Props) {
  const { progress } = useLearner();

  return (
    <div className="module-list">
      <h2>Módulos</h2>
      <div className="module-list__grid">
        {[...modules]
          .sort((a, b) => a.order - b.order)
          .map((module) => {
            const completed = module.lessonIds.filter(
              (id) => progress.lessonProgress[id]?.status === "completed"
            ).length;
            return (
              <button key={module.id} className="module-card" onClick={() => onSelectModule(module.id)}>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
                <span className="module-card__count">
                  {completed}/{module.lessonIds.length} lições concluídas
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}
