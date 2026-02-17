


export default function HistoryTable({ game, onUpdateGame }) {
  function deleteRound(id) {
    onUpdateGame({ ...game, rounds: game.rounds.filter((r) => r.id !== id) });
  }

  return (
    <div className="card">
      <h2 className="section-title">Geschiedenis</h2>

      {game.rounds.length === 0 ? (
        <div style={{ marginTop: 12, opacity: 0.7 }}>Nog geen rondes.</div>
      ) : (
        <div style={{ marginTop: 12, display: "grid", gap: 12 }}>
          {game.rounds.map((r) => {
            // Handle dealer penalty rounds
            if (r.isDealerPenalty) {
              return (
                <div 
                  key={r.id}
                  style={{
                    padding: "16px",
                    border: "1px solid #e3e6ea",
                    borderRadius: "8px",
                    backgroundColor: "#fafbfc"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "16px", color: "#b91c1c" }}>
                        Verkeerd gedeeld
                      </div>
                      <div style={{ fontSize: 14, opacity: 0.7, marginTop: "4px" }} className="mono">
                        {new Date(r.ts).toLocaleString()}
                      </div>
                      {r.note && <div style={{ fontSize: 14, opacity: 0.8, marginTop: "4px" }}>{r.note}</div>}
                    </div>
                  </div>

                  <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#fff", borderRadius: "6px" }}>
                    <div style={{ fontWeight: 500, fontSize: "14px", marginBottom: "8px", opacity: 0.8 }}>
                      Punten wijziging:
                    </div>
                    {game.players.map((p) => {
                      const d = (r.deltas && r.deltas[p.id]) || 0;
                      return (
                        <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", padding: "4px 0" }}>
                          <span>{p.name}</span>
                          <span className="mono" style={{ fontWeight: 600, color: d >= 0 ? "#15803d" : "#b91c1c" }}>
                            {d >= 0 ? `+${d}` : d}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ marginTop: "12px" }}>
                    <button onClick={() => deleteRound(r.id)} className="danger" style={{ width: "100%" }}>
                      Verwijderen
                    </button>
                  </div>
                </div>
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
              <div 
                key={r.id}
                style={{
                  padding: "16px",
                  border: "1px solid #e3e6ea",
                  borderRadius: "8px",
                  backgroundColor: "#fafbfc"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "16px" }}>
                      {gt?.name || "?"} <span style={{ opacity: 0.7 }}>({effectivePoints * (r.multiplier || 1)} punten)</span>
                    </div>
                    <div style={{ fontSize: 14, opacity: 0.7, marginTop: "4px" }} className="mono">
                      {new Date(r.ts).toLocaleString()}
                    </div>
                    {r.trumpCount && <div style={{ fontSize: 14, opacity: 0.8, marginTop: "4px" }}>{r.trumpCount} troeven</div>}
                    {r.note && <div style={{ fontSize: 14, opacity: 0.8, marginTop: "4px" }}>{r.note}</div>}
                  </div>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <div style={{ fontWeight: 500, fontSize: "14px", marginBottom: "6px", opacity: 0.8 }}>
                    Winnaars: <span style={{ fontWeight: 600, opacity: 1 }}>{winners.join(", ") || "-"}</span>
                  </div>
                </div>

                <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#fff", borderRadius: "6px" }}>
                  <div style={{ fontWeight: 500, fontSize: "14px", marginBottom: "8px", opacity: 0.8 }}>
                    Punten wijziging:
                  </div>
                  {game.players.map((p) => {
                    const d = (r.deltas && r.deltas[p.id]) || 0;
                    return (
                      <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", padding: "4px 0" }}>
                        <span>{p.name}</span>
                        <span className="mono" style={{ fontWeight: 600, color: d >= 0 ? "#15803d" : "#b91c1c" }}>
                          {d >= 0 ? `+${d}` : d}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: "12px" }}>
                  <button onClick={() => deleteRound(r.id)} className="danger" style={{ width: "100%" }}>
                    Verwijderen
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
