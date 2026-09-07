import type { RecognitionResult, SpeakOptions, VoiceCapability, VoiceProvider } from "../types/voice";

// Nível 1: adapter sobre as Web Speech APIs nativas do navegador.
// Fica isolado atrás da interface VoiceProvider — nenhum componente de UI
// importa SpeechSynthesis/SpeechRecognition diretamente.

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognitionLike) | undefined {
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
}

export class BrowserVoiceProvider implements VoiceProvider {
  readonly id = "browser";

  get capabilities(): VoiceCapability[] {
    const caps: VoiceCapability[] = [];
    if (this.isSpeechAvailable()) caps.push("speak");
    if (this.isRecognitionAvailable()) caps.push("recognize");
    return caps;
  }

  isSpeechAvailable(): boolean {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  }

  isRecognitionAvailable(): boolean {
    return typeof window !== "undefined" && !!getSpeechRecognitionCtor();
  }

  speak(text: string, options: SpeakOptions = {}): Promise<void> {
    if (!this.isSpeechAvailable()) {
      options.onEnd?.();
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang ?? "en-US";
      utterance.rate = options.rate ?? 1;

      if (options.onBoundary) {
        utterance.onboundary = (event) => {
          options.onBoundary?.(event.charIndex);
        };
      }

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(safetyTimer);
        options.onEnd?.();
        resolve();
      };

      utterance.onend = finish;
      utterance.onerror = finish;

      // Alguns navegadores/ambientes (ex.: headless sem engine de voz) nunca disparam
      // onend/onerror. Sem essa rede de segurança, a UI travaria esperando a fala acabar.
      const estimatedMs = (text.length / (options.rate ?? 1)) * 90 + 2000;
      const safetyTimer = window.setTimeout(finish, estimatedMs);

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking(): void {
    if (this.isSpeechAvailable()) {
      window.speechSynthesis.cancel();
    }
  }

  startListening(
    onResult: (result: RecognitionResult) => void,
    onError?: (error: Error) => void
  ): () => void {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      onError?.(new Error("SpeechRecognition não disponível neste navegador."));
      return () => {};
    }

    const recognition = new Ctor();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      const last = event.results[event.results.length - 1];
      onResult({
        transcript: last[0].transcript,
        isFinal: last.isFinal,
        confidence: last[0].confidence,
      });
    };

    recognition.onerror = (event: any) => {
      onError?.(new Error(event.error ?? "Erro no reconhecimento de voz."));
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }
}
