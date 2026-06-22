# Quick start: serve the AI Red Team Skill UI locally (Windows, zero dependencies).
# Usage: ./serve.ps1 [-Port 8080]
param([int]$Port = 8080)

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$url = "http://localhost:$Port/ui/"
Write-Host "AI Red Team Skill - serving at: $url"
Write-Host "Press Ctrl+C to stop."
Start-Process $url

# Serve from the repo root so the UI can load ../data/*.json.
# Use 'py' if available, otherwise fall back to 'python'.
if (Get-Command py -ErrorAction SilentlyContinue) {
    py -m http.server $Port
} else {
    python -m http.server $Port
}
