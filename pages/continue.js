import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Nav from "../components/Nav";
import GamePicker from "../components/GamePicker";
import {
  defaultAppState,
  loadAppState,
  saveAppState,
  setCurrentGame,
  deleteGame,
} from "../lib/storage";

export default function ContinuePage() {
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

  function pick(id) {
    const next = setCurrentGame(appState, id);
    setAppState(next);
    router.push("/game");
  }

  function del(id) {
    const next = deleteGame(appState, id);
    setAppState(next);
  }

  return (
    <section className="section-ourmenu bg2-pattern p-t-50 p-b-50">
      <div className="container">
        <span className="tit2 t-center">Verder spelen</span>
        <Nav homeOnly />
        <GamePicker
          games={appState.games}
          currentGameId={appState.currentGameId}
          onPick={pick}
          onDelete={del}
        />
      </div>
    </section>
  );
}
