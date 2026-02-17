

import { computeTotals } from "../lib/scoring";

export default function Scoreboard({ game, onUpdateGame }) {
  const totals = computeTotals(game.players, game.rounds);

  function updatePlayerName(pid, name) {
    onUpdateGame({
      ...game,
      players: game.players.map((p) => (p.id === pid ? { ...p, name } : p)),
    });
  }

  const sorted = game.players
    .map((p) => ({ p, total: totals[p.id] || 0 }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="card">
      <h2 className="section-title">Scoreboard</h2>

      <div style={{ overflowX: "auto" }}>
        <table >
          <thead>
            <tr>
              <th >Player</th>
              <th >Total</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(({ p, total }) => (
              <tr key={p.id}>
                <td >
                  <input
                    value={p.name}
                    onChange={(e) => updatePlayerName(p.id, e.target.value)}
                    className="input-sm"
                  />
                </td>
                <td >{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 8, opacity: 0.7, fontSize: 13 }}>
        Tip: rename players here or in Settings.
      </div>
    </div>
  );
}
