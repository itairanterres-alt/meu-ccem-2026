import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { CourseProgress, LessonProgress, SkillArea, StudentProfile } from "../types/course";
import type { AssistanceRequestType, LearnerLedger } from "../types/ledger";
import type { TutorEvaluator, EvaluationResult } from "../types/evaluation";
import type { VoiceProvider } from "../types/voice";
import { studentProfile as defaultProfile } from "../data/studentProfile";
import { ledgerSeed } from "../data/ledgerSeed";
import { BrowserVoiceProvider } from "../voice/BrowserVoiceProvider";
import { PatternEvaluator } from "../evaluation/PatternEvaluator";
import { LocalStorageAdapter } from "./storage";
import type { LessonSegment } from "../types/course";

const progressStorage = new LocalStorageAdapter<CourseProgress>("english-tutor:progress");
const ledgerStorage = new LocalStorageAdapter<LearnerLedger>("english-tutor:ledger");

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyProgress(studentId: string): CourseProgress {
  return {
    studentId,
    moduleProgress: {},
    lessonProgress: {},
    overallCompletionPercent: 0,
  };
}

interface LearnerContextValue {
  profile: StudentProfile;
  progress: CourseProgress;
  ledger: LearnerLedger;
  voiceProvider: VoiceProvider;
  evaluator: TutorEvaluator;
  actions: {
    startLesson(lessonId: string): void;
    recordDifficulty(params: {
      lessonId: string;
      segment: LessonSegment;
      helpRequested: AssistanceRequestType[];
      playbackRate: number;
    }): void;
    recordSpokenResponse(params: {
      lessonId: string;
      segment: LessonSegment;
      transcript: string;
      evaluation: EvaluationResult;
    }): void;
    completeLesson(lessonId: string, allLessonIds: string[], quizScore: number): void;
    updateSkillLevel(area: SkillArea, delta: number): void;
  };
}

const LearnerContext = createContext<LearnerContextValue | null>(null);

export function LearnerProvider({ children }: { children: ReactNode }) {
  const [profile] = useState<StudentProfile>(defaultProfile);
  const [progress, setProgress] = useState<CourseProgress>(
    () => progressStorage.load() ?? emptyProgress(defaultProfile.id)
  );
  const [ledger, setLedger] = useState<LearnerLedger>(() => ledgerStorage.load() ?? ledgerSeed);

  const voiceProvider = useMemo<VoiceProvider>(() => new BrowserVoiceProvider(), []);
  const evaluator = useMemo<TutorEvaluator>(() => new PatternEvaluator(), []);

  useEffect(() => progressStorage.save(progress), [progress]);
  useEffect(() => ledgerStorage.save(ledger), [ledger]);

  const actions = useMemo<LearnerContextValue["actions"]>(
    () => ({
      startLesson(lessonId) {
        setProgress((prev) => {
          const existing = prev.lessonProgress[lessonId];
          if (existing && existing.status !== "not-started") return prev;
          const updated: LessonProgress = {
            lessonId,
            status: "in-progress",
            attempts: (existing?.attempts ?? 0) + 1,
            lastAttemptAt: new Date().toISOString(),
            segmentsNeedingReview: existing?.segmentsNeedingReview ?? [],
          };
          return { ...prev, lessonProgress: { ...prev.lessonProgress, [lessonId]: updated } };
        });
      },

      recordDifficulty({ lessonId, segment, helpRequested, playbackRate }) {
        setLedger((prev) => ({
          ...prev,
          difficulties: [
            ...prev.difficulties,
            {
              id: createId(),
              lessonId,
              segmentId: segment.id,
              segmentText: segment.text,
              helpRequested,
              hardWords: segment.vocabulary.map((v) => v.term),
              playbackRate,
              createdAt: new Date().toISOString(),
            },
          ],
        }));

        setProgress((prev) => {
          const existing = prev.lessonProgress[lessonId];
          const reviewList = new Set(existing?.segmentsNeedingReview ?? []);
          reviewList.add(segment.id);
          const updated: LessonProgress = {
            lessonId,
            status: existing?.status ?? "in-progress",
            attempts: existing?.attempts ?? 1,
            lastAttemptAt: new Date().toISOString(),
            segmentsNeedingReview: Array.from(reviewList),
            quizScore: existing?.quizScore,
          };
          return { ...prev, lessonProgress: { ...prev.lessonProgress, [lessonId]: updated } };
        });
      },

      recordSpokenResponse({ lessonId, segment, transcript, evaluation }) {
        setLedger((prev) => ({
          ...prev,
          spokenResponses: [
            ...prev.spokenResponses,
            {
              id: createId(),
              lessonId,
              segmentId: segment.id,
              prompt: segment.text,
              transcript,
              evaluationSummary: evaluation.summary,
              matchedKeywords: evaluation.matchedKeywords,
              missedKeywords: evaluation.missedKeywords,
              score: evaluation.score,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      completeLesson(lessonId, allLessonIds, quizScore) {
        setProgress((prev) => {
          const existing = prev.lessonProgress[lessonId];
          const updated: LessonProgress = {
            lessonId,
            status: "completed",
            attempts: existing?.attempts ?? 1,
            lastAttemptAt: new Date().toISOString(),
            segmentsNeedingReview: existing?.segmentsNeedingReview ?? [],
            quizScore,
          };
          const lessonProgress = { ...prev.lessonProgress, [lessonId]: updated };
          const completedCount = allLessonIds.filter(
            (id) => lessonProgress[id]?.status === "completed"
          ).length;
          const overallCompletionPercent =
            allLessonIds.length > 0 ? Math.round((completedCount / allLessonIds.length) * 100) : 0;
          return { ...prev, lessonProgress, overallCompletionPercent };
        });
      },

      updateSkillLevel(area, delta) {
        setLedger((prev) => ({
          ...prev,
          skillLevels: {
            ...prev.skillLevels,
            [area]: Math.max(0, Math.min(100, prev.skillLevels[area] + delta)),
          },
        }));
      },
    }),
    []
  );

  const value: LearnerContextValue = { profile, progress, ledger, voiceProvider, evaluator, actions };

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

export function useLearner(): LearnerContextValue {
  const ctx = useContext(LearnerContext);
  if (!ctx) throw new Error("useLearner precisa estar dentro de <LearnerProvider>.");
  return ctx;
}
