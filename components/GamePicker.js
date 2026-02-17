


export default function GamePicker({ games, currentGameId, onPick, onDelete }) {
  return (
    <div className="card">
      <h2 className="section-title">Verder spelen</h2>

      {games.length === 0 ? (
        <div style={{ marginTop: 10, opacity: 0.7 }}>Nog geen opgeslagen spellen.</div>
      ) : (
        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          {games.map((g) => (
            <div key={g.id} style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={() => onPick(g.id)} className={g.id === currentGameId ? "primary" : ""}>
                {g.title || "Spel"} · {new Date(g.createdAt).toLocaleString()}
              </button>
              <span style={{ opacity: 0.75, fontSize: 14 }}>
                Spelers: {g.players?.length || 0} · Rondes: {g.rounds?.length || 0}
              </span>
              <span style={{ opacity: 0.75, fontSize: 14 }}>
                ({g.players?.map(p => p.name).join(", ") || "-"})
              </span>
              <button onClick={() => onDelete(g.id)} className="danger">
                Verwijderen
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
