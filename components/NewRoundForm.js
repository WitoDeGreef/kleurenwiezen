

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

  // Calculate current dealer
  const currentDealer = game.players[(game.currentDealerIndex || 0) % game.players.length];
  const isFivePlayerGame = game.players.length === 5;

  const hasTrumps = gameType?.minTrumps != null && gameType?.extraPointsPerTrump != null;
  const effectiveTrumpCount = hasTrumps && trumpCount ? parseInt(trumpCount, 10) : 0;
  
  // Check if all trumps bonus applies (when player achieves all 13 trumps)
  const usesAllTrumpsBonus = gameType?.allTrumpsBonus != null && effectiveTrumpCount === 13;
  
  // Calculate points based on trump count
  let basePoints;
  if (usesAllTrumpsBonus) {
    // All trumps: use special bonus
    basePoints = gameType.allTrumpsBonus;
  } else if (hasTrumps && effectiveTrumpCount !== 0 && effectiveTrumpCount < (gameType.minTrumps || 0)) {
    // Below minimum: negate (basePoints + penalty for missing trumps)
    const missingTrumps = (gameType.minTrumps || 0) - effectiveTrumpCount;
    const penalty = missingTrumps * (gameType.extraPointsPerTrump || 0);
    basePoints = -((gameType?.basePoints || 0) + penalty);
  } else if (hasTrumps && effectiveTrumpCount > (gameType.minTrumps || 0)) {
    // Above minimum: add bonus for extra trumps
    const extraTrumps = effectiveTrumpCount - (gameType.minTrumps || 0);
    const bonus = extraTrumps * (gameType.extraPointsPerTrump || 0);
    basePoints = (gameType?.basePoints || 0) + bonus;
  } else {
    // At minimum or no trumps: use base points
    basePoints = gameType?.basePoints || 0;
  }
  
  const total = basePoints * (Number(multiplier) || 1);
  const maxWinners = gameType?.maxWinners || game.players.length - 1;

  function toggleWinner(pid) {
    // Prevent dealer from being selected in 5-player game
    if (isFivePlayerGame && pid === currentDealer?.id) {
      return;
    }
    
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
    
    // For 5 players, dealer doesn't receive points
    const playersForDistribution = isFivePlayerGame
      ? game.players.filter(p => p.id !== currentDealer?.id)
      : game.players;
    
    const deltas = computeDeltas({
      players: playersForDistribution,
      basePoints: effectiveBasePoints,
      winnerIds,
      multiplier: m,
    });
    
    // If 5 players, ensure dealer has 0 points
    if (isFivePlayerGame && currentDealer) {
      deltas[currentDealer.id] = 0;
    }

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
    if (!currentDealer) return;
    
    const penaltyAmount = game.players.length === 4 
      ? (game.dealerPenalty4Players || 3) 
      : (game.dealerPenalty5Players || 4);
    
    // Calculate points to distribute among other players (with proper integer distribution)
    const otherPlayers = game.players.filter(p => p.id !== currentDealer.id);
    const basePoints = Math.floor(penaltyAmount / otherPlayers.length);
    let remainder = penaltyAmount - (basePoints * otherPlayers.length);
    
    // Create deltas: dealer gets negative, others get positive (divided equally with remainder)
    const deltas = {};
    deltas[currentDealer.id] = -penaltyAmount;
    
    otherPlayers.forEach((p) => {
      const extra = remainder > 0 ? 1 : 0;
      deltas[p.id] = basePoints + extra;
      remainder -= extra;
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
  // For 5-player games, dealer is excluded from playing
  const activePlayers = isFivePlayerGame ? game.players.length - 1 : game.players.length;
  const needsExactWinners = gameType?.maxWinners != null && gameType.maxWinners < activePlayers - 1;
  const hasCorrectWinnerCount = needsExactWinners 
    ? winnerIds.length === gameType.maxWinners
    : (winnerIds.length > 0 && winnerIds.length < activePlayers);
  
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
              Aantal troeven {gameType.minTrumps > 0 ? `(basis ${gameType.minTrumps})` : '(variabel)'}
            </label>
            <input 
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              min={0} 
              max={13} 
              value={trumpCount} 
              onChange={(e) => setTrumpCount(e.target.value)}
              placeholder={gameType.minTrumps > 0 ? `Basis ${gameType.minTrumps}` : 'Aantal'}
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
          {isFivePlayerGame && <span style={{ opacity: 0.7, fontWeight: 400 }}> · Dealer speelt niet mee</span>}
        </label>
        <div className="flex flex-wrap gap-8">
          {game.players.map((p) => {
            const active = winnerIds.includes(p.id);
            const isDealer = isFivePlayerGame && p.id === currentDealer?.id;
            return (
              <button 
                key={p.id} 
                onClick={() => toggleWinner(p.id)} 
                className={active ? "active" : ""} 
                disabled={isDealer}
                type="button"
                style={isDealer ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
              >
                {active ? "✓ " : ""}{p.name}{isDealer ? " (deler)" : ""}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 10, fontSize: 14, opacity: 0.8, lineHeight: 1.5 }}>
          Verdeling: <b>{total >= 0 ? `+${total}` : total}</b> verdeeld over winnaars, <b>{total >= 0 ? `-${total}` : `+${Math.abs(total)}`}</b> verdeeld over anderen{isFivePlayerGame && ', dealer krijgt 0'}.
          {usesAllTrumpsBonus && (
            <span> (Alle troeven bonus: {gameType.allTrumpsBonus} punten)</span>
          )}
          {!usesAllTrumpsBonus && hasTrumps && effectiveTrumpCount !== 0 && effectiveTrumpCount !== (gameType.minTrumps || 0) && (
            <span>
              {effectiveTrumpCount < (gameType.minTrumps || 0) 
                ? ` (Straf: ${(gameType.minTrumps || 0) - effectiveTrumpCount} troeven te weinig, totaal negatief)`
                : ` (Bonus: ${effectiveTrumpCount - (gameType.minTrumps || 0)} extra troeven)`
              }
            </span>
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
