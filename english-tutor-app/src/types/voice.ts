// Abstração de voz. O produto nunca deve depender diretamente das Web Speech APIs;
// componentes usam esta interface, e trocam de implementação sem mudar UI.

export interface SpeakOptions {
  /** 0.5 a 1.5 aproximadamente; 1 = velocidade normal. */
  rate?: number;
  lang?: string;
  onBoundary?: (charIndex: number) => void;
  onEnd?: () => void;
}

export interface RecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence?: number;
}

export type VoiceCapability = "speak" | "recognize" | "bidirectional-stream";

export interface VoiceProvider {
  readonly id: string;
  readonly capabilities: VoiceCapability[];

  /** Fala um texto em inglês. Resolve quando a fala termina (ou falha silenciosamente com fallback). */
  speak(text: string, options?: SpeakOptions): Promise<void>;

  stopSpeaking(): void;

  /** Inicia captura de fala do aluno. Retorna função de "stop". Emite resultados via callback. */
  startListening(onResult: (result: RecognitionResult) => void, onError?: (error: Error) => void): () => void;

  /** Indica se reconhecimento de voz está disponível neste ambiente (navegador/dispositivo). */
  isRecognitionAvailable(): boolean;

  /** Indica se síntese de voz está disponível. */
  isSpeechAvailable(): boolean;
}
