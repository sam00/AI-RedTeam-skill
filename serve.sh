#!/usr/bin/env bash
# Quick start: serve the AI Red Team Skill UI locally with zero dependencies.
# Usage: ./serve.sh [PORT]   (default 8080)
set -euo pipefail

PORT="${1:-8080}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

URL="http://localhost:${PORT}/ui/"
echo "AI Red Team Skill — serving at: ${URL}"
echo "Press Ctrl+C to stop."

# Best-effort: open the browser after the server starts (non-fatal).
(
  sleep 1
  if command -v open >/dev/null 2>&1; then open "$URL"
  elif command -v xdg-open >/dev/null 2>&1; then xdg-open "$URL"
  fi
) >/dev/null 2>&1 &

# Serve from the repo root so the UI can load ../data/*.json.
exec python3 -m http.server "$PORT"
