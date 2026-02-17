const STORAGE_KEY = "kleurenwiezen_multi_v1";

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function defaultGameTypes() {
  return [
    { id: "gt_vraag", name: "Vraag", basePoints: 10 },
    { id: "gt_solo", name: "Solo", basePoints: 20 },
    { id: "gt_abondance", name: "Abondance", basePoints: 30 },
    { id: "gt_misere", name: "Misère", basePoints: 30 },
    { id: "gt_open_misere", name: "Open misère", basePoints: 60 },
    { id: "gt_ander", name: "Ander", basePoints: 0 },
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
  const currentGameId = appState.currentGameId === gameId ? (games[0]?.id || null) : appState.currentGameId;
  return { ...appState, games, currentGameId };
}

export function setCurrentGame(appState, gameId) {
  return { ...appState, currentGameId: gameId };
}
