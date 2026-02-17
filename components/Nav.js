import Link from "next/link";

export default function Nav({ current = "" }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
      <Link href="/game" className={current === "game" ? "active" : ""}>Huidig spel</Link>
      <Link href="/history" className={current === "history" ? "active" : ""}>Geschiedenis</Link>
      <Link href="/settings" className={current === "settings" ? "active" : ""}>Instellingen</Link>
      <Link href="/" >Home</Link>
    </div>
  );
}
