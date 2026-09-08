import type { Lesson } from "../types/course";
import type { SessionConfig } from "../types/session";
import type { LessonSessionEvent } from "./lessonEvents";
import { firstAdaptationStep, nextAdaptationStep, type AdaptationStep } from "../pedagogy/lessonAdaptation";

export type SessionPhase = "warmup" | "listening" | "speaking" | "consolidation" | "quiz" | "debrief";

export interface LessonSessionState {
  phase: SessionPhase;
  warmupIndex: number;
  warmupCount: number;
  segmentIndex: number;
  segmentCount: number;
  segmentMode: "listening" | "assisted";
  adaptationStep: AdaptationStep | null;
  playbackRate: number;
  speakingIndex: number;
  consolidationIndex: number;
  consolidationCount: number;
  quizScore: number | null;
}

export function initLessonSessionState(lesson: Lesson, sessionConfig: SessionConfig): LessonSessionState {
  return {
    phase: sessionConfig.warmupPrompts.length > 0 ? "warmup" : "listening",
    warmupIndex: 0,
    warmupCount: sessionConfig.warmupPrompts.length,
    segmentIndex: 0,
    segmentCount: lesson.segments.length,
    segmentMode: "listening",
    adaptationStep: null,
    playbackRate: 1,
    speakingIndex: 0,
    consolidationIndex: 0,
    consolidationCount: sessionConfig.consolidation.length,
    quizScore: null,
  };
}

/** Máquina de estados pura da sessão: warm-up → Listening Ladder (com quebra adaptativa
 * sob demanda) → speaking practice → consolidation → quiz → debrief. Sem side effects —
 * gravação no Learner Ledger e chamadas de voz/avaliação ficam em useLessonSession. */
export function lessonSessionReducer(state: LessonSessionState, event: LessonSessionEvent): LessonSessionState {
  switch (event.type) {
    case "ADVANCE_WARMUP": {
      if (state.warmupIndex < state.warmupCount - 1) {
        return { ...state, warmupIndex: state.warmupIndex + 1 };
      }
      return { ...state, phase: "listening" };
    }

    case "FINISH_WARMUP":
      return { ...state, phase: "listening" };

    case "UNDERSTOOD":
      return advanceSegment(state);

    case "DID_NOT_UNDERSTAND":
      return { ...state, segmentMode: "assisted", adaptationStep: firstAdaptationStep() };

    case "ADVANCE_ADAPTATION": {
      if (!state.adaptationStep) return state;
      return { ...state, adaptationStep: nextAdaptationStep(state.adaptationStep) };
    }

    case "CONTINUE_AFTER_ASSIST":
      return advanceSegment({ ...state, segmentMode: "listening", adaptationStep: null });

    case "CHANGE_PLAYBACK_RATE":
      return { ...state, playbackRate: event.rate };

    case "SPEAKING_EVALUATED":
      return state; // side effect (registrar no ledger) fica no hook; estado avança só no CONTINUE_SPEAKING

    case "CONTINUE_SPEAKING": {
      if (state.speakingIndex < state.segmentCount - 1) {
        return { ...state, speakingIndex: state.speakingIndex + 1 };
      }
      return { ...state, phase: state.consolidationCount > 0 ? "consolidation" : "quiz" };
    }

    case "ADVANCE_CONSOLIDATION": {
      if (state.consolidationIndex < state.consolidationCount - 1) {
        return { ...state, consolidationIndex: state.consolidationIndex + 1 };
      }
      return { ...state, phase: "quiz" };
    }

    case "FINISH_CONSOLIDATION":
      return { ...state, phase: "quiz" };

    case "QUIZ_FINISHED":
      return { ...state, quizScore: event.score, phase: "debrief" };

    default:
      return state;
  }
}

function advanceSegment(state: LessonSessionState): LessonSessionState {
  if (state.segmentIndex < state.segmentCount - 1) {
    return { ...state, segmentIndex: state.segmentIndex + 1, segmentMode: "listening", adaptationStep: null };
  }
  return { ...state, phase: "speaking", speakingIndex: 0 };
}
