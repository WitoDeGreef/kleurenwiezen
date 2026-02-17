

import { useMemo, useState } from "react";
import { clampInt, computeDeltas } from "../lib/scoring";

function rid() {
  return `r_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export default function NewRoundForm({ game, onUpdateGame }) {
  const firstGT = game.gameTypes[0]?.id;

  const [gameTypeId, setGameTypeId] = useState(firstGT);
  const [winnerIds, setWinnerIds] = useState([]);
  const [multiplier, setMultiplier] = useState(1);
  const [trumpCount, setTrumpCount] = useState("");
  const [note, setNote] = useState("");

  const gameType = useMemo(
    () => game.gameTypes.find((g) => g.id === gameTypeId) || game.gameTypes[0],
    [game.gameTypes, gameTypeId]
  );

  const hasTrumps = gameType?.minTrumps != null && gameType?.extraPointsPerTrump != null;
  const effectiveTrumpCount = hasTrumps && trumpCount ? parseInt(trumpCount, 10) : 0;
  
  // Check if all trumps bonus applies (when player achieves all 13 trumps)
  const usesAllTrumpsBonus = gameType?.allTrumpsBonus != null && effectiveTrumpCount === 13;
  
  const trumpBonus = usesAllTrumpsBonus 
    ? 0 // Don't add regular trump bonus when using all trumps bonus
    : (hasTrumps && effectiveTrumpCount > (gameType.minTrumps || 0) 
      ? (effectiveTrumpCount - (gameType.minTrumps || 0)) * (gameType.extraPointsPerTrump || 0)
      : 0);
  
  const basePoints = usesAllTrumpsBonus 
    ? gameType.allTrumpsBonus 
    : (gameType?.basePoints || 0) + trumpBonus;
  const total = basePoints * (Number(multiplier) || 1);
  const maxWinners = gameType?.maxWinners || game.players.length - 1;

  function toggleWinner(pid) {
    setWinnerIds((prev) => {
      if (prev.includes(pid)) {
        return prev.filter((x) => x !== pid);
      }
      // Check if we've reached the max winners for this game type
      if (prev.length >= maxWinners) {
        return prev;
      }
      return [...prev, pid];
    });
  }

  function addRound() {
    const gt = game.gameTypes.find((g) => g.id === gameTypeId);
    if (!gt) return;

    const m = clampInt(parseInt(multiplier, 10) || 1, 1, 20);
    
    // Calculate effective base points including trump bonus
    const effectiveBasePoints = basePoints; // This already includes trump bonus from useMemo
    
    const deltas = computeDeltas({
      players: game.players,
      basePoints: effectiveBasePoints,
      winnerIds,
      multiplier: m,
    });

    const round = {
      id: rid(),
      ts: Date.now(),
      gameTypeId,
      declarerId: winnerIds[0] || null,
      winnerIds: [...winnerIds],
      multiplier: m,
      trumpCount: hasTrumps && effectiveTrumpCount ? effectiveTrumpCount : undefined,
      note: note.trim() || undefined,
      deltas,
    };

    const nextDealerIndex = ((game.currentDealerIndex || 0) + 1) % game.players.length;
    onUpdateGame({ ...game, rounds: [round, ...game.rounds], currentDealerIndex: nextDealerIndex });
    setWinnerIds([]);
    setMultiplier(1);
    setTrumpCount("");
    setNote("");
  }

  function addDealerPenalty() {
    const currentDealer = game.players[(game.currentDealerIndex || 0) % game.players.length];
    const penaltyAmount = game.players.length === 4 
      ? (game.dealerPenalty4Players || 3) 
      : (game.dealerPenalty5Players || 4);
    
    // Create deltas with only the dealer getting negative points
    const deltas = {};
    game.players.forEach((p) => {
      deltas[p.id] = p.id === currentDealer.id ? -penaltyAmount : 0;
    });

    const round = {
      id: rid(),
      ts: Date.now(),
      isDealerPenalty: true,
      penaltyAmount,
      dealerId: currentDealer.id,
      note: `Verkeerd gedeeld (${currentDealer.name})`,
      deltas,
    };

    // Dealer stays the same when dealing wrong
    onUpdateGame({ ...game, rounds: [round, ...game.rounds] });
  }

  // Validation: check if enough winners are selected based on game type requirements
  const needsExactWinners = gameType?.maxWinners != null && gameType.maxWinners < game.players.length - 1;
  const hasCorrectWinnerCount = needsExactWinners 
    ? winnerIds.length === gameType.maxWinners
    : (winnerIds.length > 0 && winnerIds.length < game.players.length);
  
  const invalid = !hasCorrectWinnerCount;

  return (
    <div className="card">
      <h2 className="section-title">Ronde toevoegen</h2>

      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
        <div>
          <label className="form-label">Speltype</label>
          <select value={gameTypeId} onChange={(e) => {
            setGameTypeId(e.target.value);
            setWinnerIds([]);
            setTrumpCount("");
          }} s>
            {game.gameTypes.map((gt) => (
              <option key={gt.id} value={gt.id}>
                {gt.name}{gt.maxWinners ? ` - ${gt.maxWinners} speler${gt.maxWinners > 1 ? 's' : ''}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Vermenigvuldiger</label>
          <input 
            type="number" 
            inputMode="numeric"
            pattern="[0-9]*"
            min={1} 
            max={20} 
            value={multiplier} 
            onChange={(e) => setMultiplier(e.target.value)}
          />
        </div>

        {hasTrumps && (
          <div>
            <label className="form-label">
              Aantal troeven {gameType.minTrumps > 0 ? `(min ${gameType.minTrumps})` : '(variabel)'}
            </label>
            <input 
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={gameType.minTrumps || 0} 
              max={13} 
              value={trumpCount} 
              onChange={(e) => setTrumpCount(e.target.value)}
              placeholder={gameType.minTrumps > 0 ? `Min ${gameType.minTrumps}` : 'Aantal'}
            />
          </div>
        )}

        <div>
          <label className="form-label">Notitie (optioneel)</label>
          <input value={note} onChange={(e) => setNote(e.target.value)}placeholder="bijv. dubbel / contra / ..." />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label className="form-label">
          Winnaars {needsExactWinners 
            ? `(exact ${gameType.maxWinners} ${gameType.maxWinners > 1 ? 'spelers' : 'speler'})` 
            : maxWinners && `(max ${maxWinners})`}
        </label>
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
        <div style={{ marginTop: 10, fontSize: 14, opacity: 0.8, lineHeight: 1.5 }}>
          Verdeling: <b>+{total}</b> verdeeld over winnaars, <b>-{total}</b> verdeeld over anderen.
          {usesAllTrumpsBonus && (
            <span> (Alle troeven bonus: {gameType.allTrumpsBonus} punten)</span>
          )}
          {!usesAllTrumpsBonus && hasTrumps && trumpBonus > 0 && (
            <span> (Inclusief {trumpBonus} bonuspunten voor {effectiveTrumpCount - (gameType.minTrumps || 0)} {gameType.minTrumps > 0 ? 'extra troeven' : 'troeven'})</span>
          )}
        </div>
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={addRound} className="primary" disabled={invalid}>
          Toevoegen
        </button>
        <button
          onClick={() => {
            setWinnerIds([]);
            setMultiplier(1);
            setTrumpCount("");
            setNote("");
          }}
          
        >
          Reset
        </button>
        <button
          onClick={addDealerPenalty}
          className="danger"
          title={`Dealer krijgt -${game.players.length === 4 ? (game.dealerPenalty4Players || 3) : (game.dealerPenalty5Players || 4)} punten voor verkeerd delen`}
        >
          Verkeerd gedeeld
        </button>
      </div>

      {invalid && (
        <div style={{ marginTop: 10, color: "#b45309" }}>
          {needsExactWinners 
            ? `Selecteer exact ${gameType.maxWinners} speler${gameType.maxWinners > 1 ? 's' : ''} (${winnerIds.length} geselecteerd).`
            : 'Kies minimaal 1 winnaar en niet iedereen.'}
        </div>
      )}
    </div>
  );
}
