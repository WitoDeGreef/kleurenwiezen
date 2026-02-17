import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../components/Nav";
import HistoryTable from "../components/HistoryTable";
import {
  defaultAppState,
  getCurrentGame,
  loadAppState,
  saveAppState,
  upsertGame,
} from "../lib/storage";

export default function HistoryPage() {
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
          <span className="tit2 t-center">Geschiedenis</span>
          <div className="card">Geen huidig spel geselecteerd. Ga naar "Verder spelen".</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
      <div className="container">
        <span className="tit2 t-center">Geschiedenis</span>
        <Nav current="history" hasGames={appState.games.length > 0} />
        <HistoryTable game={game} onUpdateGame={updateGame} />
      </div>
    </section>
  );
}
