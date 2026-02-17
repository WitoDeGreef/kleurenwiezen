import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../components/Nav";
import PlayersEditor from "../components/PlayersEditor";
import GameTypesEditor from "../components/GameTypesEditor";
import {
  defaultAppState,
  deleteGame,
  getCurrentGame,
  loadAppState,
  saveAppState,
  upsertGame,
} from "../lib/storage";

export default function SettingsPage() {
  const router = useRouter();
  const [appState, setAppState] = useState(defaultAppState());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadAppState();
    if (loaded) setAppState(loaded);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveAppState(appState);
    }
  }, [appState, isLoaded]);

  const game = useMemo(() => getCurrentGame(appState), [appState]);

  function updateGame(nextGame) {
    setAppState((s) => upsertGame(s, nextGame));
  }

  if (!game) {
    return (
      <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
        <div className="container">
          <span className="tit2 t-center">Settings</span>
          <div className="card">No current game selected.</div>
        </div>
      </section>
    );
  }

  function resetRounds() {
    if (!confirm("Reset all rounds for this game?")) return;
    updateGame({ ...game, rounds: [] });
  }

  function deleteThisGame() {
    if (!confirm("Delete this game entirely?")) return;
    const next = deleteGame(appState, game.id);
    saveAppState(next);
    setAppState(next);
    router.push("/continue");
  }

  return (
    <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
      <div className="container">
        <span className="tit2 t-center">Settings</span>
        <Nav current="settings" />

        <div className="card">
          <div className="flex flex-wrap gap-8">
            <button onClick={resetRounds} className="danger">Reset rounds</button>
            <button onClick={deleteThisGame} className="danger">Delete game</button>
          </div>
          <div style={{ marginTop: 10, opacity: 0.7, fontSize: 13 }}>
            Note: removing players/game types is restricted if referenced by existing rounds.
          </div>
        </div>

        <PlayersEditor game={game} onUpdateGame={updateGame} />
        <GameTypesEditor game={game} onUpdateGame={updateGame} />
      </div>
    </section>
  );
}
