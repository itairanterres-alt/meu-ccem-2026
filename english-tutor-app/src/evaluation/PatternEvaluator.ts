import type { EvaluationInput, EvaluationResult, TutorEvaluator } from "../types/evaluation";
import { normalizeWords, stringSimilarity } from "../lib/similarity";

// Avaliação local, sem backend. Combina três sinais — não reduz a "acertou/errou":
// 1) cobertura de palavras-chave esperadas do trecho;
// 2) similaridade textual geral com o trecho-alvo (tolera pequenas variações);
// 3) heurísticas simples de "intenção" (o aluno tentou responder, mesmo com erros?).
export class PatternEvaluator implements TutorEvaluator {
  readonly id = "pattern-local";

  async evaluate(input: EvaluationInput): Promise<EvaluationResult> {
    const { segment, transcript } = input;
    const transcriptWords = new Set(normalizeWords(transcript));
    const expected = segment.expectedKeywords ?? normalizeWords(segment.text);

    const matchedKeywords = expected.filter((kw) => transcriptWords.has(kw.toLowerCase()));
    const missedKeywords = expected.filter((kw) => !transcriptWords.has(kw.toLowerCase()));

    const keywordCoverage = expected.length > 0 ? matchedKeywords.length / expected.length : 0;
    const textSimilarity = stringSimilarity(transcript, segment.text);

    // Pontuação pondera mais a cobertura de sentido do que a forma exata da frase —
    // coerente com o relatório: reconstrução de sentido importa mais que repetição literal.
    const score = Math.min(1, keywordCoverage * 0.7 + textSimilarity * 0.3);

    const attempted = transcript.trim().length > 0;
    let summary: string;
    let suggestedCorrection: string | undefined;

    if (!attempted) {
      summary = "Nenhuma resposta capturada. Tente falar novamente, mesmo que incompleto.";
    } else if (score >= 0.8) {
      summary = "Boa reconstrução do sentido do trecho — as palavras-chave principais apareceram.";
    } else if (score >= 0.4) {
      summary = `Você chegou perto. Faltaram: ${missedKeywords.join(", ") || "pequenos detalhes"}.`;
      suggestedCorrection = segment.text;
    } else {
      summary = "A resposta ainda está distante do trecho-alvo. Vamos ouvir de novo em blocos menores.";
      suggestedCorrection = segment.text;
    }

    return { score, matchedKeywords, missedKeywords, summary, suggestedCorrection };
  }
}
