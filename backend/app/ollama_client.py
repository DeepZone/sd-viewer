from __future__ import annotations
import os
import httpx
from typing import Dict, Any, Optional

def _env(name: str, default: Optional[str] = None) -> Optional[str]:
    return os.getenv(name, default)

async def ollama_analyze(report: Dict[str, Any], raw_excerpt: str) -> str:
    base_url = (_env("OLLAMA_BASE_URL") or "").rstrip("/")
    user = (_env("OLLAMA_BASIC_USER") or "").strip()
    pwd = (_env("OLLAMA_BASIC_PASS") or "").strip()
    model = _env("OLLAMA_MODEL", "qwen2.5:7b")

    if not base_url:
        raise RuntimeError("OLLAMA_BASE_URL fehlt")

    # Prompt bewusst kompakt halten (macht es schneller & stabiler)
    prompt = (
        "Analysiere FRITZ!Box Supportdaten (DSL Fokus). Antworte strukturiert:\n"
        "1) Kurzfazit\n2) Auffälligkeiten\n3) Wahrscheinliche Ursachen (priorisiert)\n"
        "4) Nächste Schritte\n5) Unauffällig/normal\n\n"
        f"Report:\n{report}\n\n"
        f"Auszug:\n{raw_excerpt}\n"
    )

    payload: Dict[str, Any] = {"model": model, "prompt": prompt, "stream": False}
    auth = (user, pwd) if (user and pwd) else None

    try:
        async with httpx.AsyncClient(timeout=600.0) as client:
            r = await client.post(f"{base_url}/api/generate", json=payload, auth=auth)

            # Upstream-HTTP-Fehler sichtbar machen
            if r.status_code >= 400:
                body = (r.text or "")[:1500]
                raise RuntimeError(f"Upstream HTTP {r.status_code}: {body}")

            data = r.json()

            # Ollama kann {"error": "..."} liefern
            if isinstance(data, dict) and data.get("error"):
                raise RuntimeError(f"Ollama error: {data.get('error')}")

            resp = (data.get("response") or "").strip()
            if not resp:
                raise RuntimeError(f"Leere Ollama-Antwort. Raw: {str(data)[:1500]}")

            return resp

    except Exception as e:
        # garantiert nicht-leer
        raise RuntimeError(repr(e))
