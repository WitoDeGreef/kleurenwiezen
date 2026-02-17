

export default function GameTypesEditor({ game, onUpdateGame }) {
  function update(gtid, patch) {
    onUpdateGame({
      ...game,
      gameTypes: game.gameTypes.map((g) => (g.id === gtid ? { ...g, ...patch } : g)),
    });
  }

  return (
    <div className="card">
      <h2 className="section-title">Speltypes</h2>
      
      <div style={{ overflowX: "auto" }}>
        <table >
          <thead>
            <tr>
              <th >Naam</th>
              <th >Basispunten</th>
              <th >Max winnaars</th>
              <th >Min troeven</th>
              <th >Extra punten/troef</th>
              <th >Alle troeven bonus</th>
            </tr>
          </thead>
          <tbody>
            {game.gameTypes.map((gt) => (
              <tr key={gt.id}>
                <td >{gt.name}</td>
                <td >
                  <input
                    type="number"
                    value={gt.basePoints}
                    onChange={(e) => update(gt.id, { basePoints: parseInt(e.target.value || "0", 10) })}
                    className="input-xs"
                  />
                </td>
                <td >{gt.maxWinners || "Onbeperkt"}</td>
                <td >
                  {gt.minTrumps === null ? "-" : gt.minTrumps === 0 ? "Variabel" : gt.minTrumps}
                </td>
                <td >
                  {gt.extraPointsPerTrump != null ? (
                    <input
                      type="number"
                      value={gt.extraPointsPerTrump}
                      onChange={(e) => update(gt.id, { extraPointsPerTrump: parseInt(e.target.value || "0", 10) })}
                      className="input-xs"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td >
                  {gt.allTrumpsBonus != null ? (
                    <input
                      type="number"
                      value={gt.allTrumpsBonus}
                      onChange={(e) => update(gt.id, { allTrumpsBonus: parseInt(e.target.value || "0", 10) })}
                      className="input-xs"
                    />
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
