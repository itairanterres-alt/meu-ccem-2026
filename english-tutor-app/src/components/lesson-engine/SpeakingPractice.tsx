import { useEffect, useRef, useState } from "react";
import type { LessonSegment } from "../../types/course";
import type { VoiceProvider } from "../../types/voice";
import type { TutorEvaluator, EvaluationResult } from "../../types/evaluation";

interface Props {
  segment: LessonSegment;
  voiceProvider: VoiceProvider;
  evaluator: TutorEvaluator;
  onEvaluated: (transcript: string, evaluation: EvaluationResult) => void;
  onContinue: () => void;
}

export function SpeakingPractice({ segment, voiceProvider, evaluator, onEvaluated, onContinue }: Props) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [manualText, setManualText] = useState("");
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const stopRef = useRef<() => void>(() => {});
  const recognitionAvailable = voiceProvider.isRecognitionAvailable();

  useEffect(() => () => stopRef.current(), []);

  function startListening() {
    setEvaluation(null);
    setTranscript("");
    setIsListening(true);
    stopRef.current = voiceProvider.startListening(
      (result) => {
        setTranscript(result.transcript);
        if (result.isFinal) {
          setIsListening(false);
        }
      },
      () => setIsListening(false)
    );
  }

  function stopListening() {
    stopRef.current();
    setIsListening(false);
  }

  async function evaluate(finalTranscript: string) {
    const result = await evaluator.evaluate({ segment, transcript: finalTranscript });
    setEvaluation(result);
    onEvaluated(finalTranscript, result);
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
          {transcript && !isListening && !evaluation && (
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

      {evaluation && (
        <div className={`speaking-practice__result score-${evaluation.score >= 0.7 ? "high" : evaluation.score >= 0.4 ? "mid" : "low"}`}>
          <p>{evaluation.summary}</p>
          {evaluation.suggestedCorrection && (
            <p className="speaking-practice__correction">Frase de referência: "{evaluation.suggestedCorrection}"</p>
          )}
          <button className="btn btn--primary" onClick={onContinue}>
            Continuar →
          </button>
        </div>
      )}
    </div>
  );
}
