import Link from "next/link";

export default function Nav({ current = "" }) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
      <Link href="/game" className={current === "game" ? "active" : ""}>Current game</Link>
      <Link href="/history" className={current === "history" ? "active" : ""}>History</Link>
      <Link href="/settings" className={current === "settings" ? "active" : ""}>Settings</Link>
      <Link href="/" >Home</Link>
    </div>
  );
}
