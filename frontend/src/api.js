/**
 * API helper for FRITZ!Box Support Analyzer
 *
 * Architektur:
 * - Frontend läuft im Browser
 * - NGINX Proxy Manager terminiert TLS (443)
 * - /api wird vom Proxy auf das Backend (FastAPI :8088) weitergeleitet
 *
 * => Browser spricht IMMER same-origin über /api
 * => Kein Port, kein CORS, kein localhost
 */

const API_BASE = "/api";

/**
 * Upload support file (.txt)
 */
export async function uploadSupportFile(file) {
  const fd = new FormData();
  fd.append("file", file);

  const r = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: fd,
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(txt || `Upload failed (${r.status})`);
  }

  return r.json();
}

/**
 * Fetch parsed report (JSON)
 */
export async function fetchReport(id) {
  const r = await fetch(`${API_BASE}/report/${id}`);

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(txt || `Fetch report failed (${r.status})`);
  }

  return r.json();
}

/**
 * Trigger LLM / Ollama analysis
 */
export async function fetchLlm(id) {
  const r = await fetch(`${API_BASE}/llm/${id}`, {
    method: "POST",
  });

  if (!r.ok) {
    const txt = await r.text();
    throw new Error(txt || `LLM request failed (${r.status})`);
  }

  return r.json();
}
