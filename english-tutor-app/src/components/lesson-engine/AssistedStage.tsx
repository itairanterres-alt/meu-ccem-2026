import { useMemo, useState } from "react";
import type { LessonSegment } from "../../types/course";
import type { VoiceProvider } from "../../types/voice";
import type { AssistanceRequestType } from "../../types/ledger";
import { SegmentHelpPanel } from "./SegmentHelpPanel";

interface WordSpan {
  word: string;
  start: number;
}

function splitIntoWords(text: string): WordSpan[] {
  const spans: WordSpan[] = [];
  const regex = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    spans.push({ word: match[0], start: match.index });
  }
  return spans;
}

interface Props {
  segment: LessonSegment;
  voiceProvider: VoiceProvider;
  playbackRate: number;
  onContinue: () => void;
  onHelpRequested: (kind: AssistanceRequestType) => void;
}

/** Modo assistido: legenda sincronizada, destaque de trecho atual e ferramentas pedagógicas. */
export function AssistedStage({ segment, voiceProvider, playbackRate, onContinue, onHelpRequested }: Props) {
  const words = useMemo(() => splitIntoWords(segment.text), [segment.text]);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  async function playWithCaption() {
    setIsSpeaking(true);
    setCurrentWordIndex(-1);
    onHelpRequested("repeat");
    await voiceProvider.speak(segment.text, {
      rate: playbackRate,
      lang: "en-US",
      onBoundary: (charIndex) => {
        let idx = 0;
        for (let i = 0; i < words.length; i++) {
          if (words[i].start <= charIndex) idx = i;
        }
        setCurrentWordIndex(idx);
      },
    });
    setIsSpeaking(false);
  }

  return (
    <div className="assisted-stage">
      <div className="assisted-stage__caption" aria-live="polite">
        {words.map((w, i) => (
          <span key={i} className={i === currentWordIndex ? "word is-current" : "word"}>
            {w.word}{" "}
          </span>
        ))}
      </div>

      <button className="btn btn--primary" onClick={playWithCaption} disabled={isSpeaking}>
        {isSpeaking ? "🔊 Reproduzindo com legenda..." : "▶️ Ouvir com legenda sincronizada"}
      </button>

      <SegmentHelpPanel
        segment={segment}
        isSpeaking={isSpeaking}
        onRepeat={() => {
          onHelpRequested("repeat");
          playWithCaption();
        }}
      />

      <div className="assisted-stage__help-log">
        <button
          className="btn btn--ghost btn--small"
          onClick={() => onHelpRequested("translation")}
        >
          marcar: usei tradução
        </button>
        <button className="btn btn--ghost btn--small" onClick={() => onHelpRequested("vocabulary")}>
          marcar: usei vocabulário
        </button>
      </div>

      <button className="btn btn--success" onClick={onContinue}>
        Continuar →
      </button>
    </div>
  );
}
