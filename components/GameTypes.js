import { uid } from "../lib/scoring";

export default function GameTypes({ state, setState }) {
  function updateGameType(gtid, patch) {
    setState((s) => ({
      ...s,
      gameTypes: s.gameTypes.map((g) => (g.id === gtid ? { ...g, ...patch } : g)),
    }));
  }

  function addGameType() {
    setState((s) => ({
      ...s,
      gameTypes: [...s.gameTypes, { id: uid("gt"), name: "Nieuw speltype", basePoints: 10 }],
    }));
  }

  function deleteGameType(gtid) {
    setState((s) => {
      const remaining = s.gameTypes.filter((g) => g.id !== gtid);
      if (!remaining.length) return s;

      if (s.rounds.some((r) => r.gameTypeId === gtid)) {
        alert("Dit speltype wordt gebruikt in de geschiedenis. Verwijder eerst die rondes of doe Reset.");
        return s;
      }
      return { ...s, gameTypes: remaining };
    });
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kleurenwiezen-score-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={cardStyle}>
      <h2 style={h2Style}>Speltypes & punten</h2>
      <p style={{ marginTop: 6, opacity: 0.75 }}>
        Pas dit aan aan jullie afspraken.
      </p>

      <div style={{ marginTop: 10 }}>
        <label style={labelStyle}>Backup</label>
        <button onClick={exportJson} style={btnStyle({})}>Export JSON</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Naam</th>
              <th style={thStyle}>Basispunten</th>
              <th style={thStyle}></th>
            </tr>
          </thead>
          <tbody>
            {state.gameTypes.map((gt) => (
              <tr key={gt.id}>
                <td style={tdStyle()}>
                  <input
                    value={gt.name}
                    onChange={(e) => updateGameType(gt.id, { name: e.target.value })}
                    className="input-sm"
                  />
                </td>
                <td style={tdStyle()}>
                  <input
                    type="number"
                    value={gt.basePoints}
                    onChange={(e) => updateGameType(gt.id, { basePoints: parseInt(e.target.value || "0", 10) })}
                    className="input-xs"
                  />
                </td>
                <td style={tdStyle()}>
                  <button onClick={() => deleteGameType(gt.id)} style={btnStyle({ danger: true })}>
                    Verwijder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={addGameType} style={btnStyle({})}>+ Speltype</button>
      </div>
    </div>
  );
}
