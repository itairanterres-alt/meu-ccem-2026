import type { EvaluationInput, EvaluationResult, TutorEvaluator } from "../types/evaluation";

// Futuro: avaliação via LLM rodando em backend próprio (nunca chamada direto do browser
// com chave exposta). Fixa o contrato hoje para que a troca de PatternEvaluator por este
// evaluator não exija mudanças na UI — apenas na injeção de dependência (LearnerContext).
export class LlmEvaluator implements TutorEvaluator {
  readonly id = "llm-backend";
  private readonly backendEndpoint: string;

  constructor(backendEndpoint: string) {
    this.backendEndpoint = backendEndpoint;
  }

  async evaluate(_input: EvaluationInput): Promise<EvaluationResult> {
    throw new Error(
      `LlmEvaluator ainda não implementado (endpoint previsto: ${this.backendEndpoint}). ` +
        "Use PatternEvaluator nesta versão."
    );
  }
}
