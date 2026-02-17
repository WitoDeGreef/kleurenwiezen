

import { uid } from "../lib/storage";

export default function GameTypesEditor({ game, onUpdateGame }) {
  function update(gtid, patch) {
    onUpdateGame({
      ...game,
      gameTypes: game.gameTypes.map((g) => (g.id === gtid ? { ...g, ...patch } : g)),
    });
  }

  function add() {
    onUpdateGame({
      ...game,
      gameTypes: [...game.gameTypes, { id: uid("gt"), name: "Nieuw speltype", basePoints: 10 }],
    });
  }

  function remove(gtid) {
    if (game.rounds.some((r) => r.gameTypeId === gtid)) {
      alert("Dit speltype wordt gebruikt in de geschiedenis. Verwijder die rondes of Reset eerst.");
      return;
    }
    const remaining = game.gameTypes.filter((g) => g.id !== gtid);
    if (!remaining.length) return;
    onUpdateGame({ ...game, gameTypes: remaining });
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
              <th ></th>
            </tr>
          </thead>
          <tbody>
            {game.gameTypes.map((gt) => (
              <tr key={gt.id}>
                <td >
                  <input value={gt.name} onChange={(e) => update(gt.id, { name: e.target.value })} className="input-sm" />
                </td>
                <td >
                  <input
                    type="number"
                    value={gt.basePoints}
                    onChange={(e) => update(gt.id, { basePoints: parseInt(e.target.value || "0", 10) })}
                    className="input-xs"
                  />
                </td>
                <td >
                  <button onClick={() => remove(gt.id)} className="danger">
                    Verwijderen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={add} >+ Speltype</button>
      </div>
    </div>
  );
}
