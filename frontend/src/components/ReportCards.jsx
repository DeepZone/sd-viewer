import React from "react";

export default function ReportCards({ report }) {
  const facts = report?.facts || {};
  const stats = report?.stats || {};
  return (
    <div style={card}>
      <h2 style={{ marginTop: 0 }}>Overview</h2>

      <div style={grid}>
        <Stat title="Bits Array DS" value={stats.has_bits ? `${stats.bits_len} Werte` : "—"} />
        <Stat title="HLOG Downstream" value={stats.has_hlog_ds ? "vorhanden" : "—"} />
        <Stat title="HLOG Upstream" value={stats.has_hlog_us ? "vorhanden" : "—"} />
      </div>

      <h3>Extracted Facts (heuristisch)</h3>
      <div style={listBox}>
        {Object.keys(facts).length === 0 ? (
          <div style={muted}>Keine Facts erkannt (kommt mit besseren Parsern).</div>
        ) : (
          Object.entries(facts).slice(0, 80).map(([k, v]) => (
            <div key={k} style={{ marginBottom: 6 }}>
              <span style={{ color: "#cbd5e1" }}>{k}:</span>{" "}
              <span style={{ color: "#e6e6e6" }}>{v}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Stat({ title, value }) {
  return (
    <div style={statCard}>
      <div style={muted}>{title}</div>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
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

const grid = { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 };
const statCard = { border: "1px solid #222", borderRadius: 12, padding: 12, background: "#0f1620" };
const muted = { color: "#9aa4b2" };

const listBox = {
  maxHeight: 240,
  overflow: "auto",
  border: "1px solid #222",
  borderRadius: 12,
  padding: 10
};
