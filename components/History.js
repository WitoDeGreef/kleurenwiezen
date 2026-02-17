
export default function History({ state, setState }) {
  function deleteRound(id) {
    setState((s) => ({ ...s, rounds: s.rounds.filter((r) => r.id !== id) }));
  }

  return (
    <div style={cardStyle}>
      <h2 style={h2Style}>Geschiedenis</h2>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Tijd</th>
              <th style={thStyle}>Speltype</th>
              <th style={thStyle}>Declarant</th>
              <th style={thStyle}>Winnaars</th>
              <th style={thStyle}>Δ Scores</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {state.rounds.map((r) => {
              const gt = state.gameTypes.find((g) => g.id === r.gameTypeId);
              const decl = state.players.find((p) => p.id === r.declarerId);
              const winners = state.players.filter((p) => r.winnerIds.includes(p.id)).map((p) => p.name);

              return (
                <tr key={r.id}>
                  <td style={tdStyle({ mono: true })}>{new Date(r.ts).toLocaleString()}</td>
                  <td style={tdStyle()}>
                    {(gt?.name || "?")} ({(gt?.basePoints || 0) * (r.multiplier || 1)})
                    {r.note ? <div style={{ fontSize: 13, opacity: 0.8 }}>{r.note}</div> : null}
                  </td>
                  <td style={tdStyle()}>{decl?.name || "?"}</td>
                  <td style={tdStyle()}>{winners.join(", ") || "-"}</td>
                  <td style={tdStyle({ mono: true })}>
                    {state.players.map((p) => {
                      const d = (r.deltas && r.deltas[p.id]) || 0;
                      return (
                        <div key={p.id}>
                          {p.name}: {d >= 0 ? `+${d}` : d}
                        </div>
                      );
                    })}
                  </td>
                  <td style={tdStyle()}>
                    <button onClick={() => deleteRound(r.id)} style={btnStyle({ danger: true })}>
                      Verwijder
                    </button>
                  </td>
                </tr>
              );
            })}

            {state.rounds.length === 0 && (
              <tr>
                <td style={tdStyle()} colSpan={6}>
                  Geen geschiedenis.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
