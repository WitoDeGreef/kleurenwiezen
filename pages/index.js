import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { defaultAppState, loadAppState, saveAppState } from "../lib/storage";

export default function Home() {
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
            <button onClick={() => router.push("/new-game")} className="primary">Nieuw spel</button>
            <button 
              onClick={() => hasGames && router.push("/continue")} 
              className={!hasGames ? "disabled-link" : ""}
              disabled={!hasGames}
            >
              Verder spelen
            </button>
            <button 
              onClick={() => (appState.currentGameId && hasGames) && router.push("/game")} 
              className={!appState.currentGameId || !hasGames ? "disabled-link" : ""}
              disabled={!appState.currentGameId || !hasGames}
            >
              Huidig spel
            </button>
          </div>

          <div style={{ marginTop: 10, opacity: 0.75, fontSize: 14 }}>
            Lokaal opgeslagen op dit apparaat (localStorage).
          </div>
        </div>
      </div>
    </section>
  );
}
