import { useMemo, useState } from "react";
import type { LessonSegment } from "../../types/course";
import type { VoiceProvider } from "../../types/voice";
import type { AssistanceRequestType } from "../../types/ledger";
import type { AdaptationStep } from "../../pedagogy/lessonAdaptation";
import { adaptationStepLabel } from "../../pedagogy/lessonAdaptation";
import { splitIntoWords, findCurrentWordIndex } from "../../lesson-runtime/segmentTiming";
import { SegmentHelpPanel } from "./SegmentHelpPanel";

interface Props {
  segment: LessonSegment;
  voiceProvider: VoiceProvider;
  playbackRate: number;
  adaptationStep: AdaptationStep;
  onAdvance: (helpKind: AssistanceRequestType) => void;
  onFinish: () => void;
}

const STEPS: AdaptationStep[] = ["repeat", "chunked", "explained", "reconstruct", "original"];

/**
 * Intervenção pedagógica por etapas quando o aluno clica em "Não compreendi" — nunca só
 * mostra a legenda de uma vez. Segue o protocolo: repetir → segmentar em blocos → explicar
 * som/significado/contexto → reconstruir → voltar à frase original.
 */
export function AssistedStage({ segment, voiceProvider, playbackRate, adaptationStep, onAdvance, onFinish }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const words = useMemo(() => splitIntoWords(segment.text), [segment.text]);
  const stepIndex = STEPS.indexOf(adaptationStep);

  async function speak(text: string, rate = playbackRate, withCaption = false) {
    setIsSpeaking(true);
    if (withCaption) setCurrentWordIndex(-1);
    await voiceProvider.speak(text, {
      rate,
      lang: "en-US",
      onBoundary: withCaption ? (charIndex) => setCurrentWordIndex(findCurrentWordIndex(words, charIndex)) : undefined,
    });
    setIsSpeaking(false);
  }

  return (
    <div className="assisted-stage">
      <div className="assisted-stage__steps">
        {STEPS.map((step, i) => (
          <span key={step} className={`assisted-stage__step ${i <= stepIndex ? "is-done" : ""} ${step === adaptationStep ? "is-current" : ""}`}>
            {adaptationStepLabel(step)}
          </span>
        ))}
      </div>

      {adaptationStep === "repeat" && (
        <section className="assisted-stage__panel">
          <p>Vamos ouvir de novo, com calma.</p>
          <button className="btn btn--primary" onClick={() => speak(segment.text, 0.75)} disabled={isSpeaking}>
            {isSpeaking ? "🔊 Reproduzindo..." : "▶️ Repetir mais devagar"}
          </button>
          <div className="assisted-stage__actions">
            <button className="btn btn--success" onClick={onFinish}>
              Entendi agora →
            </button>
            <button className="btn btn--warning" onClick={() => onAdvance("repeat")}>
              Ainda não — quebrar em blocos
            </button>
          </div>
        </section>
      )}

      {adaptationStep === "chunked" && (
        <section className="assisted-stage__panel">
          <p>Ouça o trecho em blocos de sentido, um de cada vez.</p>
          <ul className="assisted-stage__chunks">
            {(segment.chunks ?? [segment.text]).map((chunk, i) => (
              <li key={i}>
                <button className="btn btn--ghost btn--small" onClick={() => speak(chunk, 0.8)} disabled={isSpeaking}>
                  ▶️ {chunk}
                </button>
              </li>
            ))}
          </ul>
          <div className="assisted-stage__actions">
            <button className="btn btn--success" onClick={onFinish}>
              Entendi agora →
            </button>
            <button className="btn btn--warning" onClick={() => onAdvance("vocabulary")}>
              Ainda não — explicar som e significado
            </button>
          </div>
        </section>
      )}

      {adaptationStep === "explained" && (
        <section className="assisted-stage__panel">
          {segment.connectedSpeechNote && (
            <p className="assisted-stage__connected-speech">🔗 {segment.connectedSpeechNote}</p>
          )}
          <SegmentHelpPanel segment={segment} isSpeaking={isSpeaking} onRepeat={() => speak(segment.text, 0.8)} />
          <div className="assisted-stage__actions">
            <button className="btn btn--primary" onClick={() => onAdvance("translation")}>
              Reconstruir a frase →
            </button>
          </div>
        </section>
      )}

      {adaptationStep === "reconstruct" && (
        <section className="assisted-stage__panel">
          <p>Agora junte os blocos, na ordem, em voz alta (ou mentalmente) antes de ouvir de novo:</p>
          <div className="assisted-stage__reconstruct">
            {(segment.chunks ?? [segment.text]).map((chunk, i) => (
              <span key={i} className="chunk-pill">
                {chunk}
              </span>
            ))}
          </div>
          <div className="assisted-stage__actions">
            <button className="btn btn--primary" onClick={() => onAdvance("repeat")}>
              Ouvir a frase original →
            </button>
          </div>
        </section>
      )}

      {adaptationStep === "original" && (
        <section className="assisted-stage__panel">
          <div className="assisted-stage__caption" aria-live="polite">
            {words.map((w, i) => (
              <span key={i} className={i === currentWordIndex ? "word is-current" : "word"}>
                {w.word}{" "}
              </span>
            ))}
          </div>
          <button className="btn btn--primary" onClick={() => speak(segment.text, playbackRate, true)} disabled={isSpeaking}>
            {isSpeaking ? "🔊 Reproduzindo com legenda..." : "▶️ Ouvir a frase completa"}
          </button>
          <div className="assisted-stage__actions">
            <button className="btn btn--success" onClick={onFinish}>
              Continuar →
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
