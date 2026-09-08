import type { ErrorPattern } from "../types/ledger";

/**
 * Sequência de intervenção quando o aluno clica em "Não compreendi", seguindo o protocolo
 * do relatório: repetir uma vez → segmentar em blocos → explicar (som/significado/contexto)
 * → reconstruir → voltar à frase original. Nunca fica preso repetindo o mesmo som.
 */
export type AdaptationStep = "repeat" | "chunked" | "explained" | "reconstruct" | "original";

const ADAPTATION_SEQUENCE: AdaptationStep[] = ["repeat", "chunked", "explained", "reconstruct", "original"];

export function firstAdaptationStep(): AdaptationStep {
  return ADAPTATION_SEQUENCE[0];
}

export function nextAdaptationStep(current: AdaptationStep): AdaptationStep {
  const idx = ADAPTATION_SEQUENCE.indexOf(current);
  if (idx === -1 || idx === ADAPTATION_SEQUENCE.length - 1) return "original";
  return ADAPTATION_SEQUENCE[idx + 1];
}

export function isFinalAdaptationStep(step: AdaptationStep): boolean {
  return step === "original";
}

const STEP_LABEL: Record<AdaptationStep, string> = {
  repeat: "Repetir",
  chunked: "Ouvir em blocos",
  explained: "Som e significado",
  reconstruct: "Reconstruir a frase",
  original: "Frase original",
};

export function adaptationStepLabel(step: AdaptationStep): string {
  return STEP_LABEL[step];
}

/**
 * Feedback imediato (nível 1, do protocolo de duas camadas): compara a transcrição com os
 * padrões de erro já conhecidos do aluno e devolve no máximo 2 correções, no formato
 * "Good. Two changes: ... Now continue." — nunca interrompe o fluxo com uma lista longa.
 */
export function buildImmediateFeedback(transcript: string, errorPatterns: ErrorPattern[]): string | null {
  const normalized = transcript.toLowerCase();
  const matches = errorPatterns
    .filter((pattern) => normalized.includes(pattern.example.toLowerCase()))
    .slice(0, 2);

  if (matches.length === 0) return null;

  const changes = matches.map((m) => `"${m.example}" → "${m.correctedForm}"`).join("; ");
  const countLabel = matches.length === 1 ? "One change" : "Two changes";
  return `Good. ${countLabel}: ${changes}. Now continue.`;
}
