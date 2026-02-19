export function clampInt(v, min, max) {
  const n = Number.isFinite(v) ? v : min;
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

/**
 * Flexible distribution:
 * total = basePoints * multiplier
 * winners split +total
 * others split -total
 * integers by distributing remainder
 */
export function computeDeltas({ players, basePoints, winnerIds, multiplier }) {
  const total = basePoints * multiplier;

  const winners = players.filter((p) => winnerIds.includes(p.id));
  const losers = players.filter((p) => !winnerIds.includes(p.id));

  if (!players.length) return {};
  if (!winners.length || !losers.length || total === 0) {
    return Object.fromEntries(players.map((p) => [p.id, 0]));
  }

  const deltas = {};

  const posBase = Math.trunc(total / winners.length);
  let posRem = total - posBase * winners.length;
  for (const w of winners) {
    const extra = posRem > 0 ? 1 : 0;
    deltas[w.id] = posBase + extra;
    posRem -= extra;
  }

  const negTotal = -total;
  const negBase = Math.trunc(negTotal / losers.length);
  let negRem = negTotal - negBase * losers.length;
  for (const l of losers) {
    const extra = negRem < 0 ? -1 : 0;
    deltas[l.id] = negBase + extra;
    negRem -= extra;
  }

  for (const p of players) if (deltas[p.id] === undefined) deltas[p.id] = 0;
  return deltas;
}

/**
 * Duo miserie scoring:
 * - Both win: Each winner gets basePoints, others each lose basePoints
 * - Both lose: Each loser gives basePoints, others each gain basePoints  
 * - One wins, one loses: Winner gives basePoints to loser, others unchanged
 * 
 * @param {Object} params
 * @param {Array} params.players - All players
 * @param {number} params.basePoints - Base points value
 * @param {Array} params.duoDeclarerIds - The 2 player IDs attempting together
 * @param {Array} params.winnerIds - Which declarers succeeded (0, 1, or 2)
 * @param {number} params.multiplier - Point multiplier
 */
export function computeDuoMiserieDeltas({ players, basePoints, duoDeclarerIds, winnerIds, multiplier }) {
  const total = basePoints * multiplier;
  const declarers = players.filter((p) => duoDeclarerIds.includes(p.id));
  const winners = declarers.filter((p) => winnerIds.includes(p.id));
  const losers = declarers.filter((p) => !winnerIds.includes(p.id));
  const others = players.filter((p) => !duoDeclarerIds.includes(p.id));

  if (!players.length || declarers.length !== 2) {
    return Object.fromEntries(players.map((p) => [p.id, 0]));
  }
  
  const deltas = {};

  if (winners.length === 2) {
    // Both win: Each winner gets +total, each other loses -total
    for (const w of winners) {
      deltas[w.id] = total;
    }
    for (const o of others) {
      deltas[o.id] = -total;
    }
  } else if (winners.length === 0) {
    // Both lose: Each loser gives -total, each other gains +total
    for (const l of losers) {
      deltas[l.id] = -total;
    }
    for (const o of others) {
      deltas[o.id] = total;
    }
  } else if (winners.length === 1) {
    // One wins, one loses: Winner gives to loser, others unchanged
    const winner = winners[0];
    const loser = losers[0];
    deltas[winner.id] = -total;
    deltas[loser.id] = total;
    for (const o of others) {
      deltas[o.id] = 0;
    }
  }

  for (const p of players) if (deltas[p.id] === undefined) deltas[p.id] = 0;
  return deltas;
}

export function computeTotals(players, rounds) {
  const t = Object.fromEntries(players.map((p) => [p.id, 0]));
  for (const r of rounds) {
    for (const pid of Object.keys(r.deltas || {})) {
      t[pid] = (t[pid] || 0) + (r.deltas[pid] || 0);
    }
  }
  return t;
}
