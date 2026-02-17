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

  useEffect(() => {
    if (isLoaded && appState.games.length === 0) {
      router.push("/");
    }
  }, [isLoaded, appState.games.length, router]);

  const game = useMemo(() => getCurrentGame(appState), [appState]);

  function updateGame(nextGame) {
    setAppState((s) => upsertGame(s, nextGame));
  }

  if (!game || appState.games.length === 0) {
    return (
      <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
        <div className="container">
          <span className="tit2 t-center">Instellingen</span>
          <div className="card">Geen huidig spel geselecteerd.</div>
        </div>
      </section>
    );
  }

  function resetRounds() {
    if (!confirm("Alle rondes van dit spel resetten?")) return;
    updateGame({ ...game, rounds: [] });
  }

  function deleteThisGame() {
    if (!confirm("Dit spel volledig verwijderen?")) return;
    const next = deleteGame(appState, game.id);
    setAppState(next);
    if (next.games.length === 0) {
      router.push("/");
    } else {
      router.push("/continue");
    }
  }

  return (
    <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
      <div className="container">
        <span className="tit2 t-center">Instellingen</span>
        <Nav current="settings" hasGames={appState.games.length > 0} />

        <div className="card">
          <div className="flex flex-wrap gap-8">
            <button onClick={resetRounds} className="danger">Rondes resetten</button>
            <button onClick={deleteThisGame} className="danger">Spel verwijderen</button>
          </div>
        </div>

        <PlayersEditor game={game} onUpdateGame={updateGame} />
        
        <div className="card">
          <h2 className="section-title">Strafpunten</h2>
          <div style={{ marginTop: 12 }}>
            <label className="form-label" style={{ display: "block", marginBottom: 12 }}>Strafpunten verkeerd delen</label>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div>
                <label style={{ fontSize: 13, opacity: 0.8, marginRight: 8 }}>4 spelers:</label>
                <input
                  type="number"
                  min={0}
                  value={game.dealerPenalty4Players ?? 3}
                  onChange={(e) => updateGame({ ...game, dealerPenalty4Players: e.target.value ? parseInt(e.target.value, 10) : 0 })}
                  className="input-xs"
                  style={{ width: "80px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, opacity: 0.8, marginRight: 8 }}>5 spelers:</label>
                <input
                  type="number"
                  min={0}
                  value={game.dealerPenalty5Players ?? 4}
                  onChange={(e) => updateGame({ ...game, dealerPenalty5Players: e.target.value ? parseInt(e.target.value, 10) : 0 })}
                  className="input-xs"
                  style={{ width: "80px" }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <GameTypesEditor game={game} onUpdateGame={updateGame} />
      </div>
    </section>
  );
}
