from __future__ import annotations
import os
import httpx
from typing import Dict, Any, Optional

def _env(name: str, default: Optional[str] = None) -> Optional[str]:
    return os.getenv(name, default)

async def ollama_analyze(report: Dict[str, Any], raw_excerpt: str) -> str:
    base_url = (_env("OLLAMA_BASE_URL") or "").rstrip("/")
    user = _env("OLLAMA_BASIC_USER")
    pwd = _env("OLLAMA_BASIC_PASS")
    model = _env("OLLAMA_MODEL", "qwen2.5:7b")

    if not base_url:
        raise RuntimeError("OLLAMA_BASE_URL fehlt")

    prompt = (
        "Du bist ein Netzwerktechnik-Analyst für FRITZ!Box Supportdaten (DSL Fokus).\n"
        "Gib eine strukturierte Analyse mit:\n"
        "1) Kurzfazit\n"
        "2) Auffälligkeiten (mit Begründung)\n"
        "3) Wahrscheinliche Ursachen (priorisiert)\n"
        "4) Konkrete nächste Mess-/Verifikationsschritte\n"
        "5) Was unauffällig/normal wirkt\n"
        "Wenn Daten fehlen: klar sagen.\n\n"
        "JSON-Report (aus Parsern):\n"
        f"{report}\n\n"
        "Roh-Auszug (gekürzt):\n"
        f"{raw_excerpt}\n"
    )

    payload: Dict[str, Any] = {
        "model": model,
        "prompt": prompt,
        "stream": False,
    }

    auth = (user, pwd) if (user and pwd) else None

    async with httpx.AsyncClient(timeout=120.0) as client:
        r = await client.post(f"{base_url}/api/generate", json=payload, auth=auth)
        r.raise_for_status()
        data = r.json()
        return (data.get("response") or "").strip()
