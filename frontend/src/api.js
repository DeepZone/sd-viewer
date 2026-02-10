const DEFAULT_API =
  `${window.location.protocol}//${window.location.hostname}:8088`;

const API_BASE = import.meta.env.VITE_API_BASE || DEFAULT_API;

export async function uploadSupportFile(file) {
  const fd = new FormData();
  fd.append("file", file);

  const r = await fetch(`${API_BASE}/api/upload`, {
    method: "POST",
    body: fd
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function fetchReport(id) {
  const r = await fetch(`${API_BASE}/api/report/${id}`);
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function fetchLlm(id) {
  const r = await fetch(`${API_BASE}/api/llm/${id}`, { method: "POST" });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
