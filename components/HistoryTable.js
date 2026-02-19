


export default function HistoryTable({ game, onUpdateGame }) {
  function deleteRound(id) {
    // Find the round being deleted
    const roundToDelete = game.rounds.find((r) => r.id === id);
    
    // Filter out the round
    const updatedRounds = game.rounds.filter((r) => r.id !== id);
    
    // If it's a regular round (not a dealer penalty), revert the dealer
    if (roundToDelete && !roundToDelete.isDealerPenalty) {
      const previousDealerIndex = (game.currentDealerIndex - 1 + game.players.length) % game.players.length;
      onUpdateGame({ ...game, rounds: updatedRounds, currentDealerIndex: previousDealerIndex });
    } else {
      // Dealer penalty rounds don't change the dealer, so just remove the round
      onUpdateGame({ ...game, rounds: updatedRounds });
    }
  }

  // Check if a round is the most recent (first in array since new rounds are prepended)
  function isMostRecent(roundId) {
    return game.rounds.length > 0 && game.rounds[0].id === roundId;
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
                    <button 
                      onClick={() => deleteRound(r.id)} 
                      className="danger" 
                      style={{ width: "100%" }}
                      disabled={!isMostRecent(r.id)}
                    >
                      {isMostRecent(r.id) ? 'Verwijderen' : 'Alleen laatste ronde kan verwijderd worden'}
                    </button>
                  </div>
                </div>
              );
            }

            // Handle regular game rounds
            const gt = game.gameTypes.find((g) => g.id === r.gameTypeId);
            const isDuoRound = r.duoDeclarerIds && r.duoDeclarerIds.length === 2;
            
            let declarers, winners;
            if (isDuoRound) {
              declarers = game.players.filter((p) => r.duoDeclarerIds.includes(p.id)).map((p) => p.name);
              winners = game.players.filter((p) => r.winnerIds.includes(p.id)).map((p) => p.name);
            } else {
              winners = game.players.filter((p) => r.winnerIds.includes(p.id)).map((p) => p.name);
            }
            
            // Check if all trumps bonus applies
            const usesAllTrumpsBonus = gt?.allTrumpsBonus != null && r.trumpCount === 13;
            
            // Calculate points based on trump count
            const hasTrumps = gt?.minTrumps != null && gt?.extraPointsPerTrump != null && r.trumpCount;
            let effectivePoints;
            if (usesAllTrumpsBonus) {
              // All trumps: use special bonus
              effectivePoints = gt.allTrumpsBonus;
            } else if (hasTrumps && r.trumpCount < (gt.minTrumps || 0)) {
              // Below minimum: negate (basePoints + penalty for missing trumps)
              const missingTrumps = (gt.minTrumps || 0) - r.trumpCount;
              const penalty = missingTrumps * (gt.extraPointsPerTrump || 0);
              effectivePoints = -((gt?.basePoints || 0) + penalty);
            } else if (hasTrumps && r.trumpCount > (gt.minTrumps || 0)) {
              // Above minimum: add bonus for extra trumps
              const extraTrumps = r.trumpCount - (gt.minTrumps || 0);
              const bonus = extraTrumps * (gt.extraPointsPerTrump || 0);
              effectivePoints = (gt?.basePoints || 0) + bonus;
            } else {
              // At minimum or no trumps: use base points
              effectivePoints = gt?.basePoints || 0;
            }

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
                  {isDuoRound ? (
                    <>
                      <div style={{ fontWeight: 500, fontSize: "14px", marginBottom: "6px", opacity: 0.8 }}>
                        Duo: <span style={{ fontWeight: 600, opacity: 1 }}>{declarers.join(" & ")}</span>
                      </div>
                      <div style={{ fontSize: "14px", opacity: 0.7 }}>
                        {winners.length === 2 ? "Beide geslaagd" : winners.length === 0 ? "Beide niet geslaagd" : `${winners[0]} geslaagd`}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontWeight: 500, fontSize: "14px", marginBottom: "6px", opacity: 0.8 }}>
                      Winnaars: <span style={{ fontWeight: 600, opacity: 1 }}>{winners.join(", ") || "-"}</span>
                    </div>
                  )}
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
                  <button 
                    onClick={() => deleteRound(r.id)} 
                    className="danger" 
                    style={{ width: "100%" }}
                    disabled={!isMostRecent(r.id)}
                  >
                    {isMostRecent(r.id) ? 'Verwijderen' : 'Alleen laatste ronde kan verwijderd worden'}
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
