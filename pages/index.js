import Link from "next/link";
import { useEffect, useState } from "react";
import { defaultAppState, loadAppState, saveAppState } from "../lib/storage";

export default function Home() {
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

  const hasGames = appState.games.length > 0;

  return (
    <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
      <div className="container">
        <div className="title-section-ourmenu t-center m-b-22">
          <span className="tit2 t-center">Kleurenwiezen Score</span>
        </div>

        <div className="card">
          <h2 className="section-title">Start</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
            <Link href="/new-game" className="primary">New game</Link>
            {hasGames ? (
              <Link href="/continue">Continue game</Link>
            ) : (
              <span className="disabled-link">Continue game</span>
            )}

            <Link href="/game" className={!appState.currentGameId ? "disabled-link" : ""} onClick={(e) => {
              if (!appState.currentGameId) e.preventDefault();
            }}>Current game</Link>
          </div>

          <div style={{ marginTop: 10, opacity: 0.7, fontSize: 13 }}>
            Stored locally on this device (localStorage).
          </div>
        </div>
      </div>
    </section>
  );
}
