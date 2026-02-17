import { useEffect, useMemo, useState } from "react";
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
          <span className="tit2 t-center">History</span>
          <div className="card">No current game selected. Go to “Continue game”.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
      <div className="container">
        <span className="tit2 t-center">History</span>
        <Nav current="history" />
        <HistoryTable game={game} onUpdateGame={updateGame} />
      </div>
    </section>
  );
}
