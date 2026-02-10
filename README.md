# FRITZ!Box Support Analyzer (FastAPI + React) – MVP

Dieses Projekt:
- nimmt eine Supportdatei (MVP: **Textdatei**) entgegen
- parsed DSL relevante Daten:
  - `Bits Array DS` (Bitloading)
  - `Hlog DS/US` (HLOG Kurven)
- rendert Charts im Web-UI
- optional: generiert eine KI-Analyse über deinen Ollama-Endpunkt (`https://aiapi.noisens.de`) via Basic Auth

## Voraussetzungen (Host, der die App ausführt)
Empfohlen: Docker + Docker Compose Plugin (Debian)

## Setup
1) Repo/ZIP entpacken
2) In `docker-compose.yml` die ENV Variablen setzen:
   - `OLLAMA_BASIC_USER`
   - `OLLAMA_BASIC_PASS`
   - ggf. `OLLAMA_MODEL` (`qwen2.5:7b` default) oder `llama3.1:8b`
3) Starten:
```bash
docker compose up -d --build
```

## Zugriff
- UI: http://<server>:8080
- Backend: http://<server>:8088 (optional)

## Hinweis zu deinem Reverse Proxy / TLS
Du nutzt bereits einen Reverse Proxy auf einem anderen Host.
- Diese App braucht **keinen** Reverse Proxy.
- Wenn du möchtest, kannst du später den Proxy so konfigurieren, dass er `:8080` (UI) und/oder `:8088` (API) nach außen published.

## Nächster Ausbau
- Support von `.tar/.tgz` (Supportdaten-Archive) inkl. sicherem Entpacken und Multi-File Parsern
- Mesh-Topologie & WLAN-Auslastung (wenn Sections in den Dumps vorhanden)
