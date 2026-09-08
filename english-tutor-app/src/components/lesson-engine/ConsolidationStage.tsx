import type { ConsolidationItem } from "../../types/session";

interface Props {
  item: ConsolidationItem;
  index: number;
  total: number;
  onNext: () => void;
}

/** Fase 4 da sessão padrão: reutilizar 2-3 estruturas que apareceram na aula. */
export function ConsolidationStage({ item, index, total, onNext }: Props) {
  return (
    <div className="consolidation-stage">
      <p className="consolidation-stage__hint">Consolidação · {index + 1}/{total}</p>
      <h3 className="consolidation-stage__structure">"{item.structureEn}"</h3>
      <p className="consolidation-stage__note">{item.note}</p>
      <p className="consolidation-stage__prompt">Use essa estrutura em uma frase sua, em voz alta.</p>
      <button className="btn btn--primary" onClick={onNext}>
        {index + 1 < total ? "Próxima estrutura →" : "Ir para a prática final →"}
      </button>
    </div>
  );
}
