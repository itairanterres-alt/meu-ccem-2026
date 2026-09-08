import type { Lesson } from "../../types/course";
import { useLearner } from "../../state/LearnerContext";
import { useLessonSession } from "../../lesson-runtime/useLessonSession";
import { defaultSessionConfig } from "../../data/sessionConfig";
import { WarmupStage } from "./WarmupStage";
import { ListeningStage } from "./ListeningStage";
import { AssistedStage } from "./AssistedStage";
import { SpeakingPractice } from "./SpeakingPractice";
import { ConsolidationStage } from "./ConsolidationStage";
import { MiniQuiz } from "./MiniQuiz";
import { DebriefStage } from "./DebriefStage";

interface Props {
  lesson: Lesson;
  allLessonIds: string[];
  onExit: () => void;
}

const PHASE_LABEL: Record<string, string> = {
  warmup: "Aquecimento",
  listening: "Listening Ladder",
  speaking: "Speaking practice",
  consolidation: "Consolidação",
  quiz: "Prática final",
  debrief: "Debrief",
};

/** Orquestrador da sessão padrão: warm-up → Listening Ladder → speaking → consolidation → quiz → debrief.
 * Toda a lógica de estado vive em lesson-runtime/useLessonSession — este componente só renderiza. */
export function LessonEngine({ lesson, allLessonIds, onExit }: Props) {
  const { ledger } = useLearner();
  const { session, currentSegment, speakingSegment, currentWarmup, currentConsolidation, voiceProvider, actions } =
    useLessonSession(lesson, defaultSessionConfig, allLessonIds);

  return (
    <div className="lesson-engine">
      <header className="lesson-engine__header">
        <button className="btn btn--ghost btn--small" onClick={onExit}>
          ← Voltar à lição
        </button>
        <h2>{lesson.title}</h2>
        <span className="lesson-engine__progress">{PHASE_LABEL[session.phase]}</span>
      </header>

      {lesson.sceneContext && session.phase === "listening" && (
        <p className="lesson-engine__scene">🎬 {lesson.sceneContext}</p>
      )}

      {session.phase === "warmup" && currentWarmup && (
        <WarmupStage
          prompt={currentWarmup}
          index={session.warmupIndex}
          total={session.warmupCount}
          onNext={actions.advanceWarmup}
        />
      )}

      {session.phase === "listening" && session.segmentMode === "listening" && (
        <ListeningStage
          text={currentSegment.text}
          voiceProvider={voiceProvider}
          playbackRate={session.playbackRate}
          onPlaybackRateChange={actions.changePlaybackRate}
          onUnderstood={actions.markUnderstood}
          onDidNotUnderstand={actions.markDidNotUnderstand}
        />
      )}

      {session.phase === "listening" && session.segmentMode === "assisted" && session.adaptationStep && (
        <AssistedStage
          segment={currentSegment}
          voiceProvider={voiceProvider}
          playbackRate={session.playbackRate}
          adaptationStep={session.adaptationStep}
          onAdvance={actions.requestHelp}
          onFinish={actions.continueAfterAssist}
        />
      )}

      {session.phase === "speaking" && (
        <SpeakingPractice
          segment={speakingSegment}
          voiceProvider={voiceProvider}
          onEvaluate={actions.evaluateSpokenResponse}
          onContinue={actions.continueSpeaking}
        />
      )}

      {session.phase === "consolidation" && currentConsolidation && (
        <ConsolidationStage
          item={currentConsolidation}
          index={session.consolidationIndex}
          total={session.consolidationCount}
          onNext={actions.advanceConsolidation}
        />
      )}

      {session.phase === "quiz" && <MiniQuiz questions={lesson.quiz} onFinish={actions.finishQuiz} />}

      {session.phase === "debrief" && (
        <DebriefStage lesson={lesson} ledger={ledger} quizScore={session.quizScore} onExit={onExit} />
      )}
    </div>
  );
}
