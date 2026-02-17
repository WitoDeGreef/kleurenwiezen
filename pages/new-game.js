import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../components/Nav";
import {
  createGame,
  defaultAppState,
  loadAppState,
  saveAppState,
  setCurrentGame,
  upsertGame,
} from "../lib/storage";

export default function NewGamePage() {
  const router = useRouter();
  const [appState, setAppState] = useState(defaultAppState());
  const [names, setNames] = useState(["", "", "", ""]);

  useEffect(() => {
    const loaded = loadAppState();
    if (loaded) setAppState(loaded);
  }, []);

  function setName(i, v) {
    setNames((prev) => prev.map((x, idx) => (idx === i ? v : x)));
  }

  function addNameRow() {
    setNames((prev) => (prev.length >= 5 ? prev : [...prev, ""]));
  }

  function removeNameRow() {
    setNames((prev) => (prev.length <= 4 ? prev : prev.slice(0, -1)));
  }

  function start() {
    const playerNames = names.map((n) => n.trim()).filter(Boolean);

    const game = createGame({
      playerNames: playerNames.length
        ? playerNames
        : ["Speler 1", "Speler 2", "Speler 3", "Speler 4"],
    });

    let next = upsertGame(appState, game);
    next = setCurrentGame(next, game.id);

    // ✅ IMPORTANT: persist immediately
    saveAppState(next);

    setAppState(next);
    router.push("/game");
  }

  return (
    <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
      <div className="container">
        <span className="tit2 t-center">Nieuw spel</span>
        <Nav current="" hasGames={appState.games.length > 0} />

        <div className="card">
          <h2 className="section-title">Spelersnamen</h2>

          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {names.map((n, i) => (
              <div key={i}>
                <label className="form-label">Speler {i + 1}</label>
                <input
                  value={n}
                  onChange={(e) => setName(i, e.target.value)}
                  placeholder={`Speler ${i + 1}`}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <button onClick={addNameRow}  disabled={names.length >= 5}>+ Speler</button>
            <button onClick={removeNameRow}  disabled={names.length <= 4}>- Speler</button>
            <button onClick={start} className="primary">Start spel</button>
          </div>
        </div>
      </div>
    </section>
  );
}
