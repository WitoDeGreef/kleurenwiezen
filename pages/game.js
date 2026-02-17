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

  const currentDealer = game.players[(game.currentDealerIndex || 0) % game.players.length];

  function updateGame(nextGame) {
    setAppState((s) => upsertGame(s, nextGame));
  }

  return (
    <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
      <div className="container">
        <span className="tit2 t-center">Huidig spel</span>
        <Nav current="game" hasGames={appState.games.length > 0} />

        <div className="card">
          <h2 className="section-title">Huidige gever</h2>
          <div style={{ marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            {game.players.map((p, idx) => (
              <div
                key={p.id}
                style={{
                  padding: "12px 20px",
                  borderRadius: "8px",
                  backgroundColor: idx === (game.currentDealerIndex || 0) ? "#f59e0b" : "#f3f4f6",
                  color: idx === (game.currentDealerIndex || 0) ? "#fff" : "#374151",
                  fontWeight: idx === (game.currentDealerIndex || 0) ? "600" : "normal",
                  fontSize: "16px",
                  minHeight: "48px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {idx === (game.currentDealerIndex || 0) ? "🃏 " : ""}{p.name}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, opacity: 0.7, fontSize: 14 }}>
            De gever roteert automatisch na elke ronde.
          </div>
        </div>

        <Scoreboard game={game} onUpdateGame={updateGame} />
        <NewRoundForm game={game} onUpdateGame={updateGame} />
      </div>
    </section>
  );
}
