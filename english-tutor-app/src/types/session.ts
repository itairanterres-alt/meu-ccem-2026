// Estrutura da sessão padrão descrita no relatório: warm-up → Listening Ladder →
// speaking practice → consolidation → debrief escrito. Vive em lesson-runtime.

export type SessionPhase = "warmup" | "listening" | "speaking" | "consolidation" | "debrief";

export interface WarmupPrompt {
  id: string;
  promptEn: string;
  promptPt: string;
}

export interface ConsolidationItem {
  id: string;
  structureEn: string;
  note: string;
}

export interface SessionConfig {
  warmupPrompts: WarmupPrompt[];
  consolidation: ConsolidationItem[];
}
