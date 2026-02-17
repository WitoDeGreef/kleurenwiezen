


export default function HistoryTable({ game, onUpdateGame }) {
  function deleteRound(id) {
    onUpdateGame({ ...game, rounds: game.rounds.filter((r) => r.id !== id) });
  }

  return (
    <div className="card">
      <h2 className="section-title">Geschiedenis</h2>

      <div style={{ overflowX: "auto" }}>
        <table >
          <thead>
            <tr>
              <th >Tijd</th>
              <th >Speltype</th>
              <th >Winnaars</th>
              <th >Δ</th>
              <th ></th>
            </tr>
          </thead>
          <tbody>
            {game.rounds.map((r) => {
              // Handle dealer penalty rounds
              if (r.isDealerPenalty) {
                const dealer = game.players.find((p) => p.id === r.dealerId);
                return (
                  <tr key={r.id}>
                    <td className="mono">{new Date(r.ts).toLocaleString()}</td>
                    <td >
                      <strong>Verkeerd gedeeld</strong>
                      {r.note ? <div style={{ fontSize: 12, opacity: 0.75 }}>{r.note}</div> : null}
                    </td>
                    <td >-</td>
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
                        Verwijderen
                      </button>
                    </td>
                  </tr>
                );
              }

              // Handle regular game rounds
              const gt = game.gameTypes.find((g) => g.id === r.gameTypeId);
              const winners = game.players.filter((p) => r.winnerIds.includes(p.id)).map((p) => p.name);
              
              // Check if all trumps bonus applies
              const usesAllTrumpsBonus = gt?.allTrumpsBonus != null && r.trumpCount === 13;
              
              // Calculate trump bonus if applicable
              const hasTrumps = gt?.minTrumps != null && gt?.extraPointsPerTrump != null && r.trumpCount;
              const trumpBonus = usesAllTrumpsBonus 
                ? 0
                : (hasTrumps && r.trumpCount > (gt.minTrumps || 0)
                  ? (r.trumpCount - (gt.minTrumps || 0)) * (gt.extraPointsPerTrump || 0)
                  : 0);
              const effectivePoints = usesAllTrumpsBonus 
                ? gt.allTrumpsBonus
                : (gt?.basePoints || 0) + trumpBonus;

              return (
                <tr key={r.id}>
                  <td className="mono">{new Date(r.ts).toLocaleString()}</td>
                  <td >
                    {(gt?.name || "?")} ({effectivePoints * (r.multiplier || 1)})
                    {r.trumpCount && <div style={{ fontSize: 12, opacity: 0.75 }}>{r.trumpCount} troeven</div>}
                    {r.note ? <div style={{ fontSize: 12, opacity: 0.75 }}>{r.note}</div> : null}
                  </td>
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
                      Verwijderen
                    </button>
                  </td>
                </tr>
              );
            })}

            {game.rounds.length === 0 && (
              <tr>
                <td  colSpan={6}>
                  Nog geen rondes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
