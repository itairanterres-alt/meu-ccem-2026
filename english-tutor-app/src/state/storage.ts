// Abstração de persistência. O produto não deve ficar preso mentalmente a um dispositivo:
// LearnerContext nunca importa LocalStorageProvider diretamente — recebe uma
// StorageProviderFactory injetável. A troca futura para Supabase/memória em nuvem é
// implementar uma nova factory (ex.: supabaseStorageProviderFactory) e passá-la para
// <LearnerProvider storageProviderFactory={...}> — nenhum componente muda.

export interface StorageProvider<T> {
  load(): T | null;
  save(value: T): void;
  clear(): void;
}

export type StorageProviderFactory = <T>(key: string) => StorageProvider<T>;

/** Implementação temporária de MVP. Funciona só no dispositivo/navegador atual. */
export class LocalStorageProvider<T> implements StorageProvider<T> {
  private readonly key: string;

  constructor(key: string) {
    this.key = key;
  }

  load(): T | null {
    try {
      const raw = window.localStorage.getItem(this.key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  save(value: T): void {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(value));
    } catch {
      // Armazenamento indisponível (modo privado, quota excedida): degrada
      // silenciosamente para "sem persistência" nesta sessão.
    }
  }

  clear(): void {
    try {
      window.localStorage.removeItem(this.key);
    } catch {
      // ver nota acima
    }
  }
}

export const localStorageProviderFactory: StorageProviderFactory = (key) => new LocalStorageProvider(key);
