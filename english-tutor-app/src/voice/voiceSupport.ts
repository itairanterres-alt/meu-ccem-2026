import type { VoiceProvider } from "../types/voice";
import { BrowserVoiceProvider } from "./providers/BrowserVoiceProvider";

// Ponto único de escolha de VoiceProvider. Hoje sempre devolve o provider de
// navegador (Nível 1); quando o Nível 2 existir, a troca acontece aqui — nenhum
// componente decide isso sozinho.
export function selectVoiceProvider(): VoiceProvider {
  return new BrowserVoiceProvider();
}

export interface VoiceSupportSummary {
  canSpeak: boolean;
  canRecognize: boolean;
}

export function describeVoiceSupport(provider: VoiceProvider): VoiceSupportSummary {
  return {
    canSpeak: provider.isSpeechAvailable(),
    canRecognize: provider.isRecognitionAvailable(),
  };
}
