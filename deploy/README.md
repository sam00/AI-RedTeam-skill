# Deploy the AI Red Team Skill UI

The UI is a dependency-free static web app that reads `data/*.json`. Pick any
option below. **Run all `docker`/`kubectl` commands from the repository root**
unless noted.

## Option 1 — Local (no install beyond Python)

macOS / Linux:
```bash
python3 -m http.server 8080
# open http://localhost:8080/ui/
```

Windows (PowerShell):
```powershell
py -m http.server 8080
# open http://localhost:8080/ui/
```

> Serve from the **repo root** and open the `/ui/` path so the app can reach
> `../data/*.json`. (Don't use `--directory ui`; the data folder lives one level
> up.) Any static server works — e.g. `npx serve .` then open `/ui/`.

## Option 2 — Docker
```bash
docker build -t ai-redteam-skill -f deploy/Dockerfile .
docker run --rm -p 8080:80 ai-redteam-skill
# open http://localhost:8080
```
In the image, `data/` is copied next to `index.html`, so the app fetches
`data/*.json` directly.

## Option 3 — Docker Compose
```bash
cd deploy
docker compose up --build
# open http://localhost:8080
```

## Option 4 — Kubernetes
```bash
docker build -t ai-redteam-skill:latest -f deploy/Dockerfile .
# Load the image into your local cluster:
minikube image load ai-redteam-skill:latest    # minikube
# kind load docker-image ai-redteam-skill:latest   # kind
# (or push to a registry and edit image: in k8s-deployment.yaml)

kubectl apply -f deploy/k8s-deployment.yaml
kubectl port-forward svc/ai-redteam-skill 8080:80
# open http://localhost:8080
```

## Notes
- **Static & offline:** no external CDNs or network calls; safe on isolated
  networks.
- **No data leaves the browser:** findings are stored in `localStorage` and
  exported as Markdown locally.
- **Updating content:** edit `data/*.json` (single source of truth) and the
  domain/framework Markdown files; rebuild the image to pick up changes.
- **CSP:** `deploy/nginx.conf` sets a strict same-origin Content-Security-Policy.
