import React from "react";

export default function UploadCard({ onUpload, busy }) {
  return (
    <div style={card}>
      <h2 style={{ marginTop: 0 }}>Upload</h2>
      <p style={muted}>
        Lade deine Support-Datei hoch (MVP: .txt – Archive (.tar/.tgz) kommen als nächster Schritt).
      </p>
      <input
        type="file"
        accept=".txt,.log,.cfg,.conf,.support"
        disabled={busy}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
        }}
      />
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
