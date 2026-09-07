// Abstração de persistência. Nesta versão usa localStorage; a troca futura para
// Supabase/Postgres implica apenas trocar esta classe por uma que fale com uma API,
// sem tocar em LearnerContext ou nos componentes.

export interface Storage<T> {
  load(): T | null;
  save(value: T): void;
  clear(): void;
}

export class LocalStorageAdapter<T> implements Storage<T> {
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
