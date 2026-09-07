// Similaridade simples de string (Levenshtein normalizado), usada pelo PatternEvaluator
// para tolerar variações pequenas na transcrição (erros do reconhecimento de voz, plural, etc.).

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }

  return dp[m][n];
}

/** Retorna similaridade entre 0 e 1 (1 = idêntico). */
export function stringSimilarity(a: string, b: string): number {
  const normA = a.trim().toLowerCase();
  const normB = b.trim().toLowerCase();
  if (!normA && !normB) return 1;
  const distance = levenshtein(normA, normB);
  const maxLen = Math.max(normA.length, normB.length, 1);
  return 1 - distance / maxLen;
}

export function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?;:]/g, "")
    .split(/\s+/)
    .filter(Boolean);
}
