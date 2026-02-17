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
  const [penaltyEditValues, setPenaltyEditValues] = useState({});

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

  function handlePenaltyChange(field, value) {
    setPenaltyEditValues(prev => ({ ...prev, [field]: value }));
  }

  function handlePenaltyBlur(field, value) {
    const numValue = value === "" ? 0 : parseInt(value, 10);
    updateGame({ ...game, [field]: isNaN(numValue) ? 0 : numValue });
    setPenaltyEditValues(prev => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function getPenaltyDisplayValue(field, actualValue) {
    return penaltyEditValues.hasOwnProperty(field) ? penaltyEditValues[field] : (actualValue ?? 0);
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
                <label style={{ fontSize: 14, opacity: 0.8, marginRight: 8 }}>4 spelers:</label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min={0}
                  value={getPenaltyDisplayValue('dealerPenalty4Players', game.dealerPenalty4Players)}
                  onChange={(e) => handlePenaltyChange('dealerPenalty4Players', e.target.value)}
                  onBlur={(e) => handlePenaltyBlur('dealerPenalty4Players', e.target.value)}
                  className="input-xs"
                  style={{ width: "100px" }}
                />
              </div>
              <div>
                <label style={{ fontSize: 14, opacity: 0.8, marginRight: 8 }}>5 spelers:</label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  min={0}
                  value={getPenaltyDisplayValue('dealerPenalty5Players', game.dealerPenalty5Players)}
                  onChange={(e) => handlePenaltyChange('dealerPenalty5Players', e.target.value)}
                  onBlur={(e) => handlePenaltyBlur('dealerPenalty5Players', e.target.value)}
                  className="input-xs"
                  style={{ width: "100px" }}
                />
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 13, opacity: 0.7, lineHeight: 1.5 }}>
              Bij 5 spelers speelt de dealer niet mee in reguliere rondes (krijgt 0 punten), maar kan wel verkeerd delen en dan strafpunten krijgen.
            </div>
          </div>
        </div>
        
        <GameTypesEditor game={game} onUpdateGame={updateGame} />
      </div>
    </section>
  );
}
