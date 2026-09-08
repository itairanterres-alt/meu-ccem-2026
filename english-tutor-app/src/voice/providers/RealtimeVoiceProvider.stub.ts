import type { RecognitionResult, SpeakOptions, VoiceCapability, VoiceProvider } from "../../types/voice";

// Nível 2 (futuro): adapter para uma API de voz bidirecional em tempo real
// (ex.: OpenAI Realtime API) via um backend próprio — o browser nunca guarda a chave.
// Implementação intencionalmente não funcional: existe para fixar o formato do contrato
// e permitir troca de provider (ver state/LearnerContext.tsx) sem alterar UI.
export class RealtimeVoiceProvider implements VoiceProvider {
  readonly id = "realtime";
  readonly capabilities: VoiceCapability[] = ["speak", "recognize", "bidirectional-stream"];
  private readonly backendWsUrl: string;

  constructor(backendWsUrl: string) {
    this.backendWsUrl = backendWsUrl;
  }

  isSpeechAvailable(): boolean {
    return false;
  }

  isRecognitionAvailable(): boolean {
    return false;
  }

  async speak(_text: string, _options?: SpeakOptions): Promise<void> {
    throw new Error(
      `RealtimeVoiceProvider ainda não implementado (backend previsto: ${this.backendWsUrl}). ` +
        "Use BrowserVoiceProvider nesta versão."
    );
  }

  stopSpeaking(): void {
    // sem-op até a implementação do stream em tempo real
  }

  startListening(
    _onResult: (result: RecognitionResult) => void,
    onError?: (error: Error) => void
  ): () => void {
    onError?.(new Error("RealtimeVoiceProvider ainda não implementado."));
    return () => {};
  }
}
