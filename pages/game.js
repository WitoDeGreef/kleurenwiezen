import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../components/Nav";
import Scoreboard from "../components/Scoreboard";
import NewRoundForm from "../components/NewRoundForm";
import {
  defaultAppState,
  getCurrentGame,
  loadAppState,
  saveAppState,
  upsertGame,
} from "../lib/storage";

export default function GamePage() {
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
          <span className="tit2 t-center">Huidig spel</span>
          <div className="card">
            Geen huidig spel geselecteerd.
            <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => router.push("/new-game")} className="primary">Nieuw spel</button>
              <button onClick={() => router.push("/continue")} >Verder spelen</button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
      <div className="container">
        <span className="tit2 t-center">Huidig spel</span>
        <Nav current="game" />

        <Scoreboard game={game} onUpdateGame={updateGame} />
        <NewRoundForm game={game} onUpdateGame={updateGame} />
      </div>
    </section>
  );
}
