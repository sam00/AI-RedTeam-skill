# AI Red Team Skill — static UI served by nginx.
# Build from the REPO ROOT so both ui/ and data/ are in context:
#   docker build -t ai-redteam-skill -f deploy/Dockerfile .
FROM nginx:1.27-alpine

# UI at web root; data/ copied alongside index.html so the app fetches data/*.json.
COPY ui/   /usr/share/nginx/html/
COPY data/ /usr/share/nginx/html/data/
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf

# Optional: expose reference docs read-only inside the image for convenience.
COPY domains/         /usr/share/nginx/html/domains/
COPY frameworks/      /usr/share/nginx/html/frameworks/
COPY recommendations/ /usr/share/nginx/html/recommendations/
COPY guides/          /usr/share/nginx/html/guides/

EXPOSE 80

# Lightweight container healthcheck.
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
