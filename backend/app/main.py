from __future__ import annotations
import os
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .storage import new_id, save_text, load_text
from .parsers import build_report
from .ollama_client import ollama_analyze

app = FastAPI(title="FRITZ Support Analyzer API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten for production if needed
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(os.getenv("DATA_DIR", "/data"))
MAX_UPLOAD_BYTES = int(os.getenv("MAX_UPLOAD_BYTES", "20000000"))

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/api/upload")
async def upload_support_file(file: UploadFile = File(...)):
    raw = await file.read()
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Upload zu groß")

    # MVP: expects text. Next step: tar/tgz support unpack + multi-file parsing.
    text = raw.decode("utf-8", errors="replace")

    rid = new_id()
    save_text(DATA_DIR, rid, text)
    report = build_report(text)

    return {"id": rid, "report": report}

@app.get("/api/report/{rid}")
def get_report(rid: str):
    try:
        text = load_text(DATA_DIR, rid)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Nicht gefunden")
    return build_report(text)

@app.post("/api/llm/{rid}")
async def llm_report(rid: str):
    try:
        text = load_text(DATA_DIR, rid)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Nicht gefunden")

    report = build_report(text)
    excerpt = text[:6000]  # keep prompt bounded

    try:
        resp = await ollama_analyze(report, excerpt)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Ollama Fehler: {e}")

    return {"id": rid, "model": os.getenv("OLLAMA_MODEL", "qwen2.5:7b"), "analysis": resp}
