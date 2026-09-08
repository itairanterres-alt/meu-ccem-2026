import { useEffect, useRef, useState } from "react";
import type { LessonSegment } from "../../types/course";
import type { VoiceProvider } from "../../types/voice";
import type { EvaluationResult } from "../../types/evaluation";

interface Props {
  segment: LessonSegment;
  voiceProvider: VoiceProvider;
  onEvaluate: (transcript: string) => Promise<{ evaluation: EvaluationResult; immediateFeedback: string | null }>;
  onContinue: () => void;
}

export function SpeakingPractice({ segment, voiceProvider, onEvaluate, onContinue }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [manualText, setManualText] = useState("");
  const [result, setResult] = useState<{ evaluation: EvaluationResult; immediateFeedback: string | null } | null>(null);
  const stopRef = useRef<() => void>(() => {});
  const recognitionAvailable = voiceProvider.isRecognitionAvailable();

  useEffect(() => () => stopRef.current(), []);
  useEffect(() => {
    setResult(null);
    setTranscript("");
    setManualText("");
  }, [segment.id]);

  function startListening() {
    setResult(null);
    setTranscript("");
    setIsListening(true);
    stopRef.current = voiceProvider.startListening(
      (res) => {
        setTranscript(res.transcript);
        if (res.isFinal) setIsListening(false);
      },
      () => setIsListening(false)
    );
  }

  function stopListening() {
    stopRef.current();
    setIsListening(false);
  }

  async function evaluate(finalTranscript: string) {
    const outcome = await onEvaluate(finalTranscript);
    setResult(outcome);
  }

  return (
    <div className="speaking-practice">
      <p className="speaking-practice__prompt">
        Diga em voz alta (ou digite, se preferir): <strong>"{segment.text}"</strong>
      </p>

      {recognitionAvailable ? (
        <div className="speaking-practice__voice">
          {!isListening ? (
            <button className="btn btn--primary" onClick={startListening}>
              🎙️ Começar a falar
            </button>
          ) : (
            <button className="btn btn--warning" onClick={stopListening}>
              ⏹️ Parar
            </button>
          )}
          {transcript && <p className="speaking-practice__transcript">Você disse: "{transcript}"</p>}
          {transcript && !isListening && !result && (
            <button className="btn btn--success" onClick={() => evaluate(transcript)}>
              Avaliar resposta
            </button>
          )}
        </div>
      ) : (
        <div className="speaking-practice__fallback">
          <p className="speaking-practice__fallback-note">
            Reconhecimento de voz indisponível neste navegador. Digite sua resposta:
          </p>
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            rows={2}
            placeholder="Digite o que você diria..."
          />
          <button className="btn btn--success" onClick={() => evaluate(manualText)} disabled={!manualText.trim()}>
            Avaliar resposta
          </button>
        </div>
      )}

      {result && (
        <div
          className={`speaking-practice__result score-${
            result.evaluation.score >= 0.7 ? "high" : result.evaluation.score >= 0.4 ? "mid" : "low"
          }`}
        >
          {result.immediateFeedback && (
            <p className="speaking-practice__immediate-feedback">💬 {result.immediateFeedback}</p>
          )}
          <p>{result.evaluation.summary}</p>
          {result.evaluation.suggestedCorrection && (
            <p className="speaking-practice__correction">Frase de referência: "{result.evaluation.suggestedCorrection}"</p>
          )}
          <button className="btn btn--primary" onClick={onContinue}>
            Continuar →
          </button>
        </div>
      )}
    </div>
  );
}
