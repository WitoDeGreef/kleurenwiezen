


export default function HistoryTable({ game, onUpdateGame }) {
  function deleteRound(id) {
    onUpdateGame({ ...game, rounds: game.rounds.filter((r) => r.id !== id) });
  }

  return (
    <div className="card">
      <h2 className="section-title">History</h2>

      <div style={{ overflowX: "auto" }}>
        <table >
          <thead>
            <tr>
              <th >Time</th>
              <th >Game type</th>
              <th >Declarer</th>
              <th >Winners</th>
              <th >Δ</th>
              <th ></th>
            </tr>
          </thead>
          <tbody>
            {game.rounds.map((r) => {
              const gt = game.gameTypes.find((g) => g.id === r.gameTypeId);
              const decl = game.players.find((p) => p.id === r.declarerId);
              const winners = game.players.filter((p) => r.winnerIds.includes(p.id)).map((p) => p.name);

              return (
                <tr key={r.id}>
                  <td className="mono">{new Date(r.ts).toLocaleString()}</td>
                  <td >
                    {(gt?.name || "?")} ({(gt?.basePoints || 0) * (r.multiplier || 1)})
                    {r.note ? <div style={{ fontSize: 12, opacity: 0.75 }}>{r.note}</div> : null}
                  </td>
                  <td >{decl?.name || "?"}</td>
                  <td >{winners.join(", ") || "-"}</td>
                  <td className="mono">
                    {game.players.map((p) => {
                      const d = (r.deltas && r.deltas[p.id]) || 0;
                      return (
                        <div key={p.id}>
                          {p.name}: {d >= 0 ? `+${d}` : d}
                        </div>
                      );
                    })}
                  </td>
                  <td >
                    <button onClick={() => deleteRound(r.id)} className="danger">
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {game.rounds.length === 0 && (
              <tr>
                <td  colSpan={6}>
                  No rounds yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
