import { useLearner } from "../../state/LearnerContext";

const SKILL_LABELS: Record<string, string> = {
  listening: "Listening",
  speaking: "Speaking",
  vocabulary: "Vocabulário",
  grammar: "Gramática",
};

export function LedgerPanel() {
  const { ledger } = useLearner();

  return (
    <div className="ledger-panel">
      <h2>Memória pedagógica (Learner Ledger)</h2>
      <p className="ledger-panel__intro">
        Tudo que o sistema registra sobre suas dificuldades reais — e usa para adaptar as próximas
        recomendações.
      </p>

      <section className="card">
        <h3>Nível estimado por habilidade</h3>
        <div className="ledger-panel__skills">
          {Object.entries(ledger.skillLevels).map(([area, level]) => (
            <div key={area} className="skill-bar">
              <div className="skill-bar__label">
                <span>{SKILL_LABELS[area] ?? area}</span>
                <span>{level}%</span>
              </div>
              <div className="skill-bar__track">
                <div className="skill-bar__fill" style={{ width: `${level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h3>Trechos com dificuldade registrada ({ledger.difficulties.length})</h3>
        {ledger.difficulties.length === 0 && <p className="ledger-panel__empty">Nenhuma ainda — comece uma lição.</p>}
        <ul className="ledger-panel__list">
          {ledger.difficulties
            .slice()
            .reverse()
            .map((d) => (
              <li key={d.id}>
                <p className="ledger-panel__segment-text">"{d.segmentText}"</p>
                <span className="ledger-panel__meta">
                  ajuda: {d.helpRequested.join(", ") || "—"} · velocidade: {d.playbackRate}x
                </span>
              </li>
            ))}
        </ul>
      </section>

      <section className="card">
        <h3>Respostas faladas registradas ({ledger.spokenResponses.length})</h3>
        <ul className="ledger-panel__list">
          {ledger.spokenResponses
            .slice()
            .reverse()
            .map((r) => (
              <li key={r.id}>
                <p className="ledger-panel__segment-text">"{r.transcript || "(sem transcrição)"}"</p>
                <span className="ledger-panel__meta">
                  score: {(r.score * 100).toFixed(0)}% · {r.evaluationSummary}
                </span>
              </li>
            ))}
        </ul>
      </section>

      <section className="card">
        <h3>Padrões de erro recorrentes</h3>
        <table className="ledger-panel__table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Exemplo</th>
              <th>Forma correta</th>
              <th>Ocorrências</th>
            </tr>
          </thead>
          <tbody>
            {ledger.errorPatterns.map((e) => (
              <tr key={e.id}>
                <td>{e.category}</td>
                <td>"{e.example}"</td>
                <td>"{e.correctedForm}"</td>
                <td>{e.occurrences}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
