

export default function PlayersEditor({ game, onUpdateGame }) {
  function setName(pid, name) {
    onUpdateGame({
      ...game,
      players: game.players.map((p) => (p.id === pid ? { ...p, name } : p)),
    });
  }

  return (
    <div className="card">
      <h2 className="section-title">Spelers</h2>
      <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
        {game.players.map((p) => (
          <div key={p.id}>
            <input value={p.name} onChange={(e) => setName(p.id, e.target.value)}/>
          </div>
        ))}
      </div>
    </div>
  );
}
