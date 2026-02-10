from __future__ import annotations
import re
from typing import Any, Dict, List, Optional

def _parse_int_list(csv: str) -> List[int]:
    out: List[int] = []
    for part in csv.replace(" ", "").split(","):
        if part == "":
            continue
        try:
            out.append(int(part))
        except ValueError:
            pass
    return out

def parse_bits_array_ds(text: str) -> Optional[List[int]]:
    # e.g. "Bits Array DS: 0,0,0,0,0,13,13,14..."
    m = re.search(r"Bits\s+Array\s+DS:\s*([0-9,\s-]+)", text, re.IGNORECASE)
    if not m:
        return None
    vals = _parse_int_list(m.group(1))
    return vals if vals else None

def parse_hlog(text: str) -> Dict[str, Any]:
    """Parse Hlog DS/US integer arrays if present."""
    out: Dict[str, Any] = {"ds": None, "us": None}

    mds = re.search(r"Hlog\s+DS:\s*([0-9,\s-]+)", text, re.IGNORECASE)
    mus = re.search(r"Hlog\s+US:\s*([0-9,\s-]+)", text, re.IGNORECASE)

    if mds:
        out["ds"] = _parse_int_list(mds.group(1))
    if mus:
        out["us"] = _parse_int_list(mus.group(1))

    return out

def parse_key_facts(text: str) -> Dict[str, Any]:
    """Heuristic Key:Value extraction for overview cards."""
    facts: Dict[str, Any] = {}
    for line in text.splitlines():
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        k = k.strip()
        v = v.strip()
        if not k or not v:
            continue
        if len(k) > 60:
            continue
        wanted = (
            "FRITZ!Box", "Fritz", "Firmware", "FRITZ!OS", "Kernel", "Uptime",
            "Profile", "Vector", "G.Vector", "INP", "Bitswap",
            "Downstream", "Upstream", "Attainable", "SNR", "CRC", "FEC",
        )
        if any(w.lower() in k.lower() for w in wanted):
            facts[k] = v
    return facts

def build_report(text: str) -> Dict[str, Any]:
    bits = parse_bits_array_ds(text)
    hlog = parse_hlog(text)
    facts = parse_key_facts(text)

    report: Dict[str, Any] = {
        "facts": facts,
        "dsl": {
            "bits_array_ds": bits,
            "hlog": hlog,
        },
        "stats": {
            "has_bits": bits is not None,
            "bits_len": len(bits) if bits else 0,
            "has_hlog_ds": isinstance(hlog.get("ds"), list) and bool(hlog["ds"]),
            "has_hlog_us": isinstance(hlog.get("us"), list) and bool(hlog["us"]),
        },
    }
    return report
