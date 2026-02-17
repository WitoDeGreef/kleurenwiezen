


export default function GamePicker({ games, currentGameId, onPick, onDelete }) {
  return (
    <div className="card">
      <h2 className="section-title">Continue game</h2>

      {games.length === 0 ? (
        <div style={{ marginTop: 10, opacity: 0.7 }}>No saved games yet.</div>
      ) : (
        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          {games.map((g) => (
            <div key={g.id} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => onPick(g.id)} className={g.id === currentGameId ? "primary" : ""}>
                {g.title || "Game"} · {new Date(g.createdAt).toLocaleString()}
              </button>
              <span style={{ opacity: 0.7, fontSize: 13 }}>
                Players: {g.players?.length || 0} · Rounds: {g.rounds?.length || 0}
              </span>
              <button onClick={() => onDelete(g.id)} className="danger">
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
