// Reexporta as utilidades de texto/tempo pelo namespace do runtime da lição, para quem
// está montando estágios de sessão não precisar saber que a implementação vive em lib/text.
export { splitIntoWords, findCurrentWordIndex, estimateSpeechDurationMs, type WordSpan } from "../lib/text";
