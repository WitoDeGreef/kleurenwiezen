const STORAGE_KEY = "kleurenwiezen_multi_v1";

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function defaultGameTypes() {
  return [
    { id: "gt_samen8", name: "Samen 8", basePoints: 8, maxWinners: 2, minTrumps: 8, allTrumpsBonus: 30, extraPointsPerTrump: 2 },
    { id: "gt_samen9", name: "Samen 9", basePoints: 8, maxWinners: 2, minTrumps: 9, allTrumpsBonus: 30, extraPointsPerTrump: 2 },
    { id: "gt_samen10", name: "Samen 10", basePoints: 8, maxWinners: 2, minTrumps: 10, allTrumpsBonus: 30, extraPointsPerTrump: 2 },
    { id: "gt_samen11", name: "Samen 11", basePoints: 8, maxWinners: 2, minTrumps: 11, allTrumpsBonus: 30, extraPointsPerTrump: 2 },
    { id: "gt_samen12", name: "Samen 12", basePoints: 8, maxWinners: 2, minTrumps: 12, allTrumpsBonus: 30, extraPointsPerTrump: 2 },
    { id: "gt_samen13", name: "Samen 13", basePoints: 8, maxWinners: 2, minTrumps: 13 },
    { id: "gt_solo6", name: "Solo 6", basePoints: 13, maxWinners: 1, minTrumps: 6, extraPointsPerTrump: 3 },
    { id: "gt_solo7", name: "Solo 7", basePoints: 13, maxWinners: 1, minTrumps: 7, extraPointsPerTrump: 3 },
    { id: "gt_solo8", name: "Solo 8", basePoints: 13, maxWinners: 1, minTrumps: 8, extraPointsPerTrump: 3 },
    { id: "gt_kleine_misere", name: "Kleine miserie", basePoints: 21, maxWinners: 1, minTrumps: null },
    { id: "gt_kleine_misere2", name: "Kleine miserie", basePoints: 21, maxWinners: 2, minTrumps: null, supportsDuo: true },
    { id: "gt_piccolo", name: "Piccolo", basePoints: 24, maxWinners: 1, minTrumps: null },
    { id: "gt_troel8", name: "Troel 8", basePoints: 16, maxWinners: 2, minTrumps: 8, allTrumpsBonus: 30, extraPointsPerTrump: 2 },
    { id: "gt_troel9", name: "Troel 9", basePoints: 16, maxWinners: 2, minTrumps: 9, allTrumpsBonus: 30, extraPointsPerTrump: 2 },
    { id: "gt_abondance9", name: "Abondance 9", basePoints: 36, maxWinners: 1, minTrumps: 9 },
    { id: "gt_abondance10", name: "Abondance 10", basePoints: 36, maxWinners: 1, minTrumps: 10 },
    { id: "gt_abondance11", name: "Abondance 11", basePoints: 36, maxWinners: 1, minTrumps: 11 },
    { id: "gt_grote_misere", name: "Grote miserie", basePoints: 42, maxWinners: 1, minTrumps: null },
    { id: "gt_grote_misere2", name: "Grote miserie", basePoints: 42, maxWinners: 2, minTrumps: null, supportsDuo: true },
    { id: "gt_blote_misere", name: "Blote miserie", basePoints: 72, maxWinners: 1, minTrumps: null },
    { id: "gt_blote_misere2", name: "Blote miserie", basePoints: 72, maxWinners: 2, minTrumps: null, supportsDuo: true },
    { id: "gt_soloslim", name: "Soloslim", basePoints: 180, maxWinners: 1, minTrumps: null },
  ];
}

export function defaultAppState() {
  return {
    currentGameId: null,
    games: [],
  };
}

export function loadAppState() {
  try {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.games)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAppState(state) {
  try {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function createGame({ playerNames }) {
  const players = playerNames
    .map((name, idx) => ({
      id: uid("p"),
      name: (name || "").trim() || `Speler ${idx + 1}`,
    }))
    .filter((p) => p.name.trim().length > 0);

  return {
    id: uid("game"),
    createdAt: Date.now(),
    title: `Spel ${new Date().toLocaleString()}`,
    players: players.length ? players : [{ id: uid("p"), name: "Speler 1" }],
    gameTypes: defaultGameTypes(),
    rounds: [],
    currentDealerIndex: 0,
    dealerPenalty4Players: 3,
    dealerPenalty5Players: 4,
  };
}

export function getCurrentGame(appState) {
  const id = appState?.currentGameId;
  if (!id) return null;
  return appState.games.find((g) => g.id === id) || null;
}

export function upsertGame(appState, game) {
  const idx = appState.games.findIndex((g) => g.id === game.id);
  if (idx === -1) return { ...appState, games: [game, ...appState.games] };
  const nextGames = [...appState.games];
  nextGames[idx] = game;
  return { ...appState, games: nextGames };
}

export function deleteGame(appState, gameId) {
  const games = appState.games.filter((g) => g.id !== gameId);
  let currentGameId = appState.currentGameId === gameId ? (games[0]?.id || null) : appState.currentGameId;
  
  // Ensure currentGameId is null if there are no games left
  if (games.length === 0) {
    currentGameId = null;
  }
  
  return { ...appState, games, currentGameId };
}

export function setCurrentGame(appState, gameId) {
  return { ...appState, currentGameId: gameId };
}
