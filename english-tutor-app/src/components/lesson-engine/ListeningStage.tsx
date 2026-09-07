import { useState } from "react";
import type { VoiceProvider } from "../../types/voice";

interface Props {
  text: string;
  voiceProvider: VoiceProvider;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  onUnderstood: () => void;
  onDidNotUnderstand: () => void;
}

/** Etapa listening-first: áudio sem legenda, com "Não compreendi" como único gatilho de ajuda. */
export function ListeningStage({
  text,
  voiceProvider,
  playbackRate,
  onPlaybackRateChange,
  onUnderstood,
  onDidNotUnderstand,
}: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  async function play() {
    setIsSpeaking(true);
    await voiceProvider.speak(text, { rate: playbackRate, lang: "en-US" });
    setIsSpeaking(false);
    setHasPlayed(true);
  }

  return (
    <div className="listening-stage">
      <p className="listening-stage__hint">
        Ouça o trecho. A transcrição fica oculta até você clicar em "Não compreendi".
      </p>

      <div className="listening-stage__controls">
        <button className="btn btn--primary" onClick={play} disabled={isSpeaking}>
          {isSpeaking ? "🔊 Reproduzindo..." : "▶️ Ouvir trecho"}
        </button>

        <label className="listening-stage__rate">
          Velocidade
          <select
            value={playbackRate}
            onChange={(e) => onPlaybackRateChange(Number(e.target.value))}
          >
            <option value={0.7}>Lenta (0.7x)</option>
            <option value={1}>Normal (1x)</option>
            <option value={1.15}>Rápida (1.15x)</option>
          </select>
        </label>
      </div>

      <div className="listening-stage__decision">
        <button className="btn btn--success" onClick={onUnderstood} disabled={!hasPlayed}>
          ✅ Entendi
        </button>
        <button className="btn btn--warning" onClick={onDidNotUnderstand} disabled={!hasPlayed}>
          🤔 Não compreendi
        </button>
      </div>
    </div>
  );
}
