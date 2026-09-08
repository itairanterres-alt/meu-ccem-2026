import type { WarmupPrompt } from "../../types/session";

interface Props {
  prompt: WarmupPrompt;
  index: number;
  total: number;
  onNext: () => void;
}

/** Fase 1 da sessão padrão: 2 minutos de aquecimento oral, sem avaliação. */
export function WarmupStage({ prompt, index, total, onNext }: Props) {
  return (
    <div className="warmup-stage">
      <p className="warmup-stage__hint">Aquecimento oral · pergunta {index + 1}/{total}</p>
      <h3 className="warmup-stage__prompt-en">{prompt.promptEn}</h3>
      <p className="warmup-stage__prompt-pt">{prompt.promptPt}</p>
      <p className="warmup-stage__note">Responda em voz alta, sem se preocupar com erros — é só para aquecer.</p>
      <button className="btn btn--primary" onClick={onNext}>
        {index + 1 < total ? "Próxima pergunta →" : "Ir para o Listening Ladder →"}
      </button>
    </div>
  );
}
