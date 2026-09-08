// Utilidades genéricas de texto/tempo de fala — sem dependência de React ou de domínio.
// voice/ e lesson-runtime/ importam daqui; lesson-runtime/segmentTiming.ts reexporta para
// quem prefere importar pelo namespace do runtime da lição.

export interface WordSpan {
  word: string;
  start: number;
}

export function splitIntoWords(text: string): WordSpan[] {
  const spans: WordSpan[] = [];
  const regex = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    spans.push({ word: match[0], start: match.index });
  }
  return spans;
}

/** Índice da palavra atual dado um charIndex vindo do evento onBoundary do TTS. */
export function findCurrentWordIndex(words: WordSpan[], charIndex: number): number {
  let idx = -1;
  for (let i = 0; i < words.length; i++) {
    if (words[i].start <= charIndex) idx = i;
  }
  return idx;
}

/** Estimativa de duração da fala em ms — usada como rede de segurança quando o navegador
 * não dispara o evento de fim de fala. ~90ms por caractere é uma aproximação grosseira de
 * fala em ritmo normal; sempre soma uma margem fixa. */
export function estimateSpeechDurationMs(text: string, rate = 1): number {
  return (text.length / rate) * 90 + 2000;
}
