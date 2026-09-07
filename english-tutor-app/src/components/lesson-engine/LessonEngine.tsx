import { useEffect, useState } from "react";
import type { Lesson } from "../../types/course";
import { useLearner } from "../../state/LearnerContext";
import { ListeningStage } from "./ListeningStage";
import { AssistedStage } from "./AssistedStage";
import { SpeakingPractice } from "./SpeakingPractice";
import { MiniQuiz } from "./MiniQuiz";

type Phase = "listening" | "assisted" | "speaking" | "quiz" | "done";

interface Props {
  lesson: Lesson;
  allLessonIds: string[];
  onExit: () => void;
}

/** Núcleo reutilizável: listening-first → (sob demanda) modo assistido → prática de fala → quiz. */
export function LessonEngine({ lesson, allLessonIds, onExit }: Props) {
  const { voiceProvider, evaluator, actions } = useLearner();
  const [phase, setPhase] = useState<Phase>("listening");
  const [segmentIndex, setSegmentIndex] = useState(0);
  const [speakingIndex, setSpeakingIndex] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  useEffect(() => {
    actions.startLesson(lesson.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const segment = lesson.segments[segmentIndex];
  const speakingSegment = lesson.segments[speakingIndex];

  function goToNextSegment() {
    if (segmentIndex < lesson.segments.length - 1) {
      setSegmentIndex((i) => i + 1);
      setPhase("listening");
    } else {
      setPhase("speaking");
      setSpeakingIndex(0);
    }
  }

  function goToNextSpeaking() {
    if (speakingIndex < lesson.segments.length - 1) {
      setSpeakingIndex((i) => i + 1);
    } else {
      setPhase("quiz");
    }
  }

  return (
    <div className="lesson-engine">
      <header className="lesson-engine__header">
        <button className="btn btn--ghost btn--small" onClick={onExit}>
          ← Voltar à lição
        </button>
        <h2>{lesson.title}</h2>
        <span className="lesson-engine__progress">
          {phase === "quiz" || phase === "done"
            ? "Prática final"
            : phase === "speaking"
              ? `Fala ${speakingIndex + 1}/${lesson.segments.length}`
              : `Trecho ${segmentIndex + 1}/${lesson.segments.length}`}
        </span>
      </header>

      {phase === "listening" && (
        <ListeningStage
          text={segment.text}
          voiceProvider={voiceProvider}
          playbackRate={playbackRate}
          onPlaybackRateChange={setPlaybackRate}
          onUnderstood={goToNextSegment}
          onDidNotUnderstand={() => {
            actions.recordDifficulty({
              lessonId: lesson.id,
              segment,
              helpRequested: [],
              playbackRate,
            });
            setPhase("assisted");
          }}
        />
      )}

      {phase === "assisted" && (
        <AssistedStage
          segment={segment}
          voiceProvider={voiceProvider}
          playbackRate={playbackRate}
          onContinue={goToNextSegment}
          onHelpRequested={(kind) =>
            actions.recordDifficulty({
              lessonId: lesson.id,
              segment,
              helpRequested: [kind],
              playbackRate,
            })
          }
        />
      )}

      {phase === "speaking" && (
        <SpeakingPractice
          segment={speakingSegment}
          voiceProvider={voiceProvider}
          evaluator={evaluator}
          onEvaluated={(transcript, evaluation) => {
            actions.recordSpokenResponse({ lessonId: lesson.id, segment: speakingSegment, transcript, evaluation });
            actions.updateSkillLevel("speaking", evaluation.score >= 0.7 ? 1 : evaluation.score < 0.4 ? -1 : 0);
          }}
          onContinue={goToNextSpeaking}
        />
      )}

      {phase === "quiz" && (
        <MiniQuiz
          questions={lesson.quiz}
          onFinish={(score) => {
            actions.completeLesson(lesson.id, allLessonIds, score);
            actions.updateSkillLevel("listening", score >= 0.7 ? 2 : 0);
            setPhase("done");
          }}
        />
      )}

      {phase === "done" && (
        <div className="lesson-engine__done">
          <h3>Lição concluída ✅</h3>
          <p>O progresso e as dificuldades registradas já entraram no seu Learner Ledger.</p>
          <button className="btn btn--primary" onClick={onExit}>
            Voltar ao curso
          </button>
        </div>
      )}
    </div>
  );
}
