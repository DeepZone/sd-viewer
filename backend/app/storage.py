from __future__ import annotations
from pathlib import Path
import uuid

def ensure_dir(p: Path) -> None:
    p.mkdir(parents=True, exist_ok=True)

def new_id() -> str:
    return uuid.uuid4().hex

def save_text(data_dir: Path, rid: str, text: str) -> Path:
    ensure_dir(data_dir)
    p = data_dir / f"{rid}.txt"
    p.write_text(text, encoding="utf-8", errors="replace")
    return p

def load_text(data_dir: Path, rid: str) -> str:
    p = data_dir / f"{rid}.txt"
    return p.read_text(encoding="utf-8", errors="replace")
