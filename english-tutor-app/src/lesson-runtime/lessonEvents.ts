import type { SegmentHelpKind } from "../types/course";
import type { EvaluationResult } from "../types/evaluation";

export type LessonSessionEvent =
  | { type: "ADVANCE_WARMUP" }
  | { type: "FINISH_WARMUP" }
  | { type: "UNDERSTOOD" }
  | { type: "DID_NOT_UNDERSTAND" }
  | { type: "ADVANCE_ADAPTATION"; helpKind?: SegmentHelpKind }
  | { type: "CONTINUE_AFTER_ASSIST" }
  | { type: "CHANGE_PLAYBACK_RATE"; rate: number }
  | { type: "SPEAKING_EVALUATED"; transcript: string; evaluation: EvaluationResult }
  | { type: "CONTINUE_SPEAKING" }
  | { type: "ADVANCE_CONSOLIDATION" }
  | { type: "FINISH_CONSOLIDATION" }
  | { type: "QUIZ_FINISHED"; score: number };
