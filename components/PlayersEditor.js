

import { uid } from "../lib/storage";

export default function PlayersEditor({ game, onUpdateGame }) {
  function setName(pid, name) {
    onUpdateGame({
      ...game,
      players: game.players.map((p) => (p.id === pid ? { ...p, name } : p)),
    });
  }

  function addPlayer() {
    if (game.players.length >= 5) return;
    onUpdateGame({
      ...game,
      players: [...game.players, { id: uid("p"), name: `Speler ${game.players.length + 1}` }],
    });
  }

  function removePlayer(pid) {
    if (game.players.length <= 4) return;
    if (game.rounds.length > 0) {
      alert("Verwijder spelers alleen na Reset (om ongeldige oude rondes te voorkomen).");
      return;
    }
    onUpdateGame({ ...game, players: game.players.filter((p) => p.id !== pid) });
  }

  return (
    <div className="card">
      <h2 className="section-title">Spelers</h2>
      <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
        {game.players.map((p) => (
          <div key={p.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input value={p.name} onChange={(e) => setName(p.id, e.target.value)}/>
            <button
              onClick={() => removePlayer(p.id)}
              className="danger"
              disabled={game.players.length <= 4 || game.rounds.length > 0}
            >
              Verwijderen
            </button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <button onClick={addPlayer}  disabled={game.players.length >= 5}>
          + Speler
        </button>
        <span style={{ opacity: 0.7, fontSize: 13 }}>(min 4, max 5)</span>
      </div>
    </div>
  );
}
