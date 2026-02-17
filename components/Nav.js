import { useRouter } from "next/router";

export default function Nav({ current = "", hasGames = true, homeOnly = false }) {
  const router = useRouter();
  
  if (homeOnly) {
    return (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        <button onClick={() => router.push("/")}>Home</button>
      </div>
    );
  }
  
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
      <button 
        className={!hasGames ? "disabled-link" : (current === "game" ? "active" : "")}
        onClick={() => {
          if (hasGames) router.push("/game");
        }}
        disabled={!hasGames}
      >
        Huidig spel
      </button>
      <button 
        className={!hasGames ? "disabled-link" : (current === "history" ? "active" : "")}
        onClick={() => {
          if (hasGames) router.push("/history");
        }}
        disabled={!hasGames}
      >
        Geschiedenis
      </button>
      <button 
        className={!hasGames ? "disabled-link" : (current === "settings" ? "active" : "")}
        onClick={() => {
          if (hasGames) router.push("/settings");
        }}
        disabled={!hasGames}
      >
        Instellingen
      </button>
      <button onClick={() => router.push("/")}>Home</button>
    </div>
  );
}
