

import { computeTotals } from "../lib/scoring";

export default function Scoreboard({ game, onUpdateGame }) {
  const totals = computeTotals(game.players, game.rounds);

  const playersWithTotals = game.players
    .map((p) => ({ p, total: totals[p.id] || 0 }));

  return (
    <div className="card">
      <h2 className="section-title">Scorebord</h2>

      <div style={{ overflowX: "auto" }}>
        <table >
          <thead>
            <tr>
              <th >Speler</th>
              <th >Totaal</th>
            </tr>
          </thead>
          <tbody>
            {playersWithTotals.map(({ p, total }) => (
              <tr key={p.id}>
                <td >{p.name}</td>
                <td >{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
