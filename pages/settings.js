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
    saveAppState(next);
    setAppState(next);
    router.push("/continue");
  }

  return (
    <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
      <div className="container">
        <span className="tit2 t-center">Instellingen</span>
        <Nav current="settings" />

        <div className="card">
          <div className="flex flex-wrap gap-8">
            <button onClick={resetRounds} className="danger">Rondes resetten</button>
            <button onClick={deleteThisGame} className="danger">Spel verwijderen</button>
          </div>
          <div style={{ marginTop: 10, opacity: 0.7, fontSize: 13 }}>
            Let op: spelers/speltypes verwijderen is beperkt als ze in bestaande rondes voorkomen.
          </div>
        </div>

        <PlayersEditor game={game} onUpdateGame={updateGame} />
        <GameTypesEditor game={game} onUpdateGame={updateGame} />
      </div>
    </section>
  );
}
