

import { computeTotals } from "../lib/scoring";

export default function Scoreboard({ game, onUpdateGame }) {
  const totals = computeTotals(game.players, game.rounds);

  const playersWithTotals = game.players
    .map((p) => ({ p, total: totals[p.id] || 0 }))
    .sort((a, b) => b.total - a.total); // Sort by score descending

  const maxScore = Math.max(...playersWithTotals.map(pt => pt.total));

  return (
    <div className="card">
      <h2 className="section-title">Scorebord</h2>

      <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
        {playersWithTotals.map(({ p, total }, index) => {
          const isLeader = total === maxScore && total > 0;
          return (
            <div 
              key={p.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 16px",
                backgroundColor: isLeader ? "#f0fdf4" : "#fff",
                border: isLeader ? "2px solid #15803d" : "1px solid #e3e6ea",
                borderRadius: "8px",
                fontSize: "16px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ 
                  fontSize: "14px", 
                  fontWeight: 600, 
                  opacity: 0.5,
                  minWidth: "24px"
                }}>
                  #{index + 1}
                </span>
                <span style={{ fontWeight: isLeader ? 600 : 500 }}>
                  {p.name}
                  {isLeader && <span style={{ marginLeft: "8px", fontSize: "14px" }}>👑</span>}
                </span>
              </div>
              <span 
                className="mono" 
                style={{ 
                  fontWeight: 700, 
                  fontSize: "20px",
                  color: total > 0 ? "#15803d" : total < 0 ? "#b91c1c" : "#666"
                }}
              >
                {total > 0 ? `+${total}` : total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
