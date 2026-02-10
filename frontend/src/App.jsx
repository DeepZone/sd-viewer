import React, { useState } from "react";
import { uploadSupportFile, fetchLlm } from "./api.js";
import UploadCard from "./components/UploadCard.jsx";
import ReportCards from "./components/ReportCards.jsx";
import DslCharts from "./components/DslCharts.jsx";
import LlmPanel from "./components/LlmPanel.jsx";

export default function App() {
  const [busy, setBusy] = useState(false);
  const [rid, setRid] = useState(null);
  const [report, setReport] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [err, setErr] = useState("");

  async function onUpload(file) {
    setErr("");
    setAnalysis("");
    setBusy(true);
    try {
      const res = await uploadSupportFile(file);
      setRid(res.id);
      setReport(res.report);
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function runLlm() {
    if (!rid) return;
    setErr("");
    setBusy(true);
    try {
      const res = await fetchLlm(rid);
      setAnalysis(res.analysis || "");
    } catch (e) {
      setErr(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={page}>
      <header style={{ marginBottom: 18 }}>
        <h1 style={{ margin: 0 }}>FRITZ!Box Support Analyzer</h1>
        <div style={muted}>Upload → Parser → Charts → (optional) KI</div>
      </header>

      {err ? <div style={errorBox}>{err}</div> : null}

      <div style={layout}>
        <UploadCard onUpload={onUpload} busy={busy} />
        {report ? <ReportCards report={report} /> : <Empty text="Noch kein Report – lade eine Datei hoch." />}
      </div>

      <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: 14 }}>
        {report ? <DslCharts report={report} /> : <Empty text="DSL Charts erscheinen nach Upload." />}
        <LlmPanel analysis={analysis} onRun={runLlm} busy={busy || !rid} />
      </div>
    </div>
  );
}

function Empty({ text }) {
  return (
    <div style={card}>
      <div style={muted}>{text}</div>
    </div>
  );
}

const page = { minHeight: "100vh", padding: 18, background: "#070a0f", color: "#e6e6e6", fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" };
const layout = { display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: 14 };

const card = { border: "1px solid #222", borderRadius: 14, padding: 16, background: "#0b0f14" };
const muted = { color: "#9aa4b2" };
const errorBox = { border: "1px solid #4b1d1d", background: "#1a0f0f", padding: 12, borderRadius: 12, marginBottom: 12, color: "#ffb4b4", whiteSpace: "pre-wrap" };
