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

export function computeTotals(players, rounds) {
  const t = Object.fromEntries(players.map((p) => [p.id, 0]));
  for (const r of rounds) {
    for (const pid of Object.keys(r.deltas || {})) {
      t[pid] = (t[pid] || 0) + (r.deltas[pid] || 0);
    }
  }
  return t;
}
