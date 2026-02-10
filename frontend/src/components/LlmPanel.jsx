import React from "react";

export default function LlmPanel({ analysis, onRun, busy }) {
  return (
    <div style={card}>
      <h2 style={{ marginTop: 0 }}>KI-Analyse</h2>
      <p style={muted}>
        Läuft über deinen Ollama-Endpunkt. Credentials liegen nur im Backend (ENV).
      </p>
      <button onClick={onRun} disabled={busy} style={btn}>
        {busy ? "Analysiere…" : "Analyse erzeugen"}
      </button>

      <div style={box}>
        {analysis ? analysis : <span style={muted}>Noch keine Analyse.</span>}
      </div>
    </div>
  );
}

const card = {
  border: "1px solid #222",
  borderRadius: 14,
  padding: 16,
  background: "#0b0f14",
  color: "#e6e6e6"
};
const muted = { color: "#9aa4b2" };
const btn = { padding: "10px 12px", borderRadius: 10, border: "1px solid #222", background: "#0f1620", color: "#e6e6e6", cursor: "pointer" };
const box = { marginTop: 12, whiteSpace: "pre-wrap", border: "1px solid #222", borderRadius: 12, padding: 12, minHeight: 180 };
