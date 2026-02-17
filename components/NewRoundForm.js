

import { useMemo, useState } from "react";
import { clampInt, computeDeltas } from "../lib/scoring";

function rid() {
  return `r_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export default function NewRoundForm({ game, onUpdateGame }) {
  const firstGT = game.gameTypes[0]?.id;
  const firstP = game.players[0]?.id;

  const [gameTypeId, setGameTypeId] = useState(firstGT);
  const [declarerId, setDeclarerId] = useState(firstP);
  const [winnerIds, setWinnerIds] = useState(firstP ? [firstP] : []);
  const [multiplier, setMultiplier] = useState(1);
  const [note, setNote] = useState("");

  const gameType = useMemo(
    () => game.gameTypes.find((g) => g.id === gameTypeId) || game.gameTypes[0],
    [game.gameTypes, gameTypeId]
  );

  const basePoints = gameType?.basePoints || 0;
  const total = basePoints * (Number(multiplier) || 1);

  function toggleWinner(pid) {
    setWinnerIds((prev) => (prev.includes(pid) ? prev.filter((x) => x !== pid) : [...prev, pid]));
  }

  function addRound() {
    const gt = game.gameTypes.find((g) => g.id === gameTypeId);
    if (!gt) return;

    const m = clampInt(parseInt(multiplier, 10) || 1, 1, 20);
    const deltas = computeDeltas({
      players: game.players,
      basePoints: gt.basePoints,
      winnerIds,
      multiplier: m,
    });

    const round = {
      id: rid(),
      ts: Date.now(),
      gameTypeId,
      declarerId,
      winnerIds: [...winnerIds],
      multiplier: m,
      note: note.trim() || undefined,
      deltas,
    };

    onUpdateGame({ ...game, rounds: [round, ...game.rounds] });
    setNote("");
  }

  const invalid = winnerIds.length === 0 || winnerIds.length === game.players.length;

  return (
    <div className="card">
      <h2 className="section-title">Ronde toevoegen</h2>

      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        <div>
          <label className="form-label">Speltype</label>
          <select value={gameTypeId} onChange={(e) => setGameTypeId(e.target.value)} s>
            {game.gameTypes.map((gt) => (
              <option key={gt.id} value={gt.id}>
                {gt.name} ({gt.basePoints})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Aanvrager</label>
          <select value={declarerId} onChange={(e) => setDeclarerId(e.target.value)} s>
            {game.players.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Vermenigvuldiger</label>
          <input type="number" min={1} max={20} value={multiplier} onChange={(e) => setMultiplier(e.target.value)}/>
        </div>

        <div>
          <label className="form-label">Notitie (optioneel)</label>
          <input value={note} onChange={(e) => setNote(e.target.value)}placeholder="bijv. dubbel / contra / ..." />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label className="form-label">Winnaars</label>
        <div className="flex flex-wrap gap-8">
          {game.players.map((p) => {
            const active = winnerIds.includes(p.id);
            return (
              <button key={p.id} onClick={() => toggleWinner(p.id)} className={active ? "active" : ""} type="button">
                {active ? "✓ " : ""}{p.name}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 8, fontSize: 13, opacity: 0.75 }}>
          Verdeling: <b>+{total}</b> verdeeld over winnaars, <b>-{total}</b> verdeeld over anderen.
        </div>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={addRound} className="primary" disabled={invalid}>
          Toevoegen
        </button>
        <button
          onClick={() => {
            setWinnerIds(declarerId ? [declarerId] : []);
            setMultiplier(1);
            setNote("");
          }}
          
        >
          Reset
        </button>
      </div>

      {invalid && <div style={{ marginTop: 10, color: "#b45309" }}>Kies minimaal 1 winnaar en niet iedereen.</div>}
    </div>
  );
}
