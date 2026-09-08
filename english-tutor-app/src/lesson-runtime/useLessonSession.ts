import { useEffect, useMemo, useReducer } from "react";
import type { Lesson } from "../types/course";
import type { SessionConfig } from "../types/session";
import { useLearner } from "../state/LearnerContext";
import { lessonSessionReducer, initLessonSessionState } from "./lessonSessionReducer";
import { buildImmediateFeedback } from "../pedagogy/lessonAdaptation";
import type { AssistanceRequestType } from "../types/ledger";

/**
 * Conecta a máquina de estados pura (lessonSessionReducer) aos efeitos colaterais reais:
 * gravação no Learner Ledger, chamadas de voz/avaliação. O componente de UI (LessonEngine)
 * só lê `session` e chama as funções de `actions` — não sabe nada sobre reducer ou ledger.
 */
export function useLessonSession(lesson: Lesson, sessionConfig: SessionConfig, allLessonIds: string[]) {
  const { voiceProvider, evaluator, ledger, actions: learnerActions } = useLearner();
  const [session, dispatch] = useReducer(lessonSessionReducer, undefined, () =>
    initLessonSessionState(lesson, sessionConfig)
  );

  useEffect(() => {
    learnerActions.startLesson(lesson.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id]);

  const currentSegment = lesson.segments[session.segmentIndex];
  const speakingSegment = lesson.segments[session.speakingIndex];
  const currentWarmup = sessionConfig.warmupPrompts[session.warmupIndex];
  const currentConsolidation = sessionConfig.consolidation[session.consolidationIndex];

  const actions = useMemo(
    () => ({
      advanceWarmup: () => dispatch({ type: "ADVANCE_WARMUP" }),

      markUnderstood: () => dispatch({ type: "UNDERSTOOD" }),

      markDidNotUnderstand: () => {
        learnerActions.recordDifficulty({
          lessonId: lesson.id,
          segment: currentSegment,
          helpRequested: [],
          playbackRate: session.playbackRate,
        });
        dispatch({ type: "DID_NOT_UNDERSTAND" });
      },

      requestHelp: (kind: AssistanceRequestType) => {
        learnerActions.recordDifficulty({
          lessonId: lesson.id,
          segment: currentSegment,
          helpRequested: [kind],
          playbackRate: session.playbackRate,
        });
        dispatch({ type: "ADVANCE_ADAPTATION", helpKind: kind });
      },

      continueAfterAssist: () => dispatch({ type: "CONTINUE_AFTER_ASSIST" }),

      changePlaybackRate: (rate: number) => dispatch({ type: "CHANGE_PLAYBACK_RATE", rate }),

      evaluateSpokenResponse: async (transcript: string) => {
        const evaluation = await evaluator.evaluate({ segment: speakingSegment, transcript });
        learnerActions.recordSpokenResponse({ lessonId: lesson.id, segment: speakingSegment, transcript, evaluation });
        learnerActions.updateSkillLevel("speaking", evaluation.score >= 0.7 ? 1 : evaluation.score < 0.4 ? -1 : 0);
        dispatch({ type: "SPEAKING_EVALUATED", transcript, evaluation });
        const immediateFeedback = buildImmediateFeedback(transcript, ledger.errorPatterns);
        return { evaluation, immediateFeedback };
      },

      continueSpeaking: () => dispatch({ type: "CONTINUE_SPEAKING" }),

      advanceConsolidation: () => dispatch({ type: "ADVANCE_CONSOLIDATION" }),

      finishQuiz: (score: number) => {
        learnerActions.completeLesson(lesson.id, allLessonIds, score);
        learnerActions.updateSkillLevel("listening", score >= 0.7 ? 2 : 0);
        dispatch({ type: "QUIZ_FINISHED", score });
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lesson.id, currentSegment, speakingSegment, session.playbackRate, ledger.errorPatterns]
  );

  return {
    session,
    currentSegment,
    speakingSegment,
    currentWarmup,
    currentConsolidation,
    voiceProvider,
    evaluator,
    actions,
  };
}
