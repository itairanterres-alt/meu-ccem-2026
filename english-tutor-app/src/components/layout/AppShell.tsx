import type { ReactNode } from "react";

export type View = "dashboard" | "modules" | "ledger";

interface Props {
  activeView: View;
  onNavigate: (view: View) => void;
  children: ReactNode;
}

const NAV_ITEMS: { id: View; label: string; icon: string }[] = [
  { id: "dashboard", label: "Painel", icon: "🏠" },
  { id: "modules", label: "Módulos", icon: "📚" },
  { id: "ledger", label: "Memória pedagógica", icon: "🧠" },
];

export function AppShell({ activeView, onNavigate, children }: Props) {
  return (
    <div className="app-shell">
      <header className="app-shell__topbar">
        <span className="app-shell__logo">🗣️ English Tutor</span>
        <span className="app-shell__tag">curso adaptativo · MVP</span>
      </header>

      <div className="app-shell__body">
        <nav className="app-shell__nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`app-shell__nav-item ${activeView === item.id ? "is-active" : ""}`}
              onClick={() => onNavigate(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <main className="app-shell__main">{children}</main>
      </div>
    </div>
  );
}
