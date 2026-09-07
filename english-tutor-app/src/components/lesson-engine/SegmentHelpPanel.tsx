import { useState } from "react";
import type { LessonSegment } from "../../types/course";

type HelpTab = "translation" | "vocabulary" | "explanation" | "pronunciation" | "example";

const TABS: { id: HelpTab; label: string }[] = [
  { id: "translation", label: "Tradução" },
  { id: "explanation", label: "Explicação" },
  { id: "vocabulary", label: "Vocabulário" },
  { id: "pronunciation", label: "Pronúncia" },
  { id: "example", label: "Exemplo" },
];

interface Props {
  segment: LessonSegment;
  onRepeat: () => void;
  isSpeaking: boolean;
}

export function SegmentHelpPanel({ segment, onRepeat, isSpeaking }: Props) {
  const [activeTab, setActiveTab] = useState<HelpTab>("translation");

  return (
    <div className="help-panel">
      <div className="help-panel__tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`help-panel__tab ${activeTab === tab.id ? "is-active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="help-panel__content">
        {activeTab === "translation" && <p>{segment.translation}</p>}
        {activeTab === "explanation" && <p>{segment.explanation}</p>}
        {activeTab === "vocabulary" && (
          <ul className="help-panel__vocab">
            {segment.vocabulary.map((v) => (
              <li key={v.term}>
                <strong>{v.term}</strong> — {v.translation}
                {v.note && <span className="help-panel__vocab-note"> ({v.note})</span>}
              </li>
            ))}
          </ul>
        )}
        {activeTab === "pronunciation" && (
          <p className="help-panel__pronunciation">{segment.pronunciationHint}</p>
        )}
        {activeTab === "example" && <p>{segment.example}</p>}
      </div>

      <button className="btn btn--ghost" onClick={onRepeat} disabled={isSpeaking}>
        🔁 Repetir trecho
      </button>
    </div>
  );
}
