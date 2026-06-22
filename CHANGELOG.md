# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/), and the project aims to follow
[Semantic Versioning](https://semver.org/).

## [1.0.0] — 2025

### Added
- **Skill (agent) package** — lightweight `SKILL.md` router with progressive
  disclosure across eight domains: AI red team methodology, application security,
  cloud (AWS, GCP), hybrid infrastructure, Kubernetes, identity (Okta/SSO),
  social engineering, and AI/LLM security.
- **AI Red Team engineer methodology** — `domains/ai-red-team-engineer.md`
  covering role, approach, target/attacker models, tooling, and workflow.
- **Authoring guide** — `guides/authoring-skills.md` for writing agent skills and
  technique playbooks.
- **Framework references** — MITRE ATT&CK, MITRE ATLAS, OWASP Top 10, OWASP LLM
  Top 10 (2025), NIST AI RMF, and a cross-mapping matrix.
- **Structured data** — `data/techniques.json`, `data/tools.json`,
  `data/mappings.json` as the single source of truth.
- **Standalone UI** — dependency-free, offline web app (`ui/`) to filter, search,
  and map techniques to frameworks and export a Markdown findings draft.
- **Deployment** — Docker, Docker Compose, Kubernetes manifest, and hardened
  nginx config, plus `deploy/README.md`.
- **Recommendations** — remediation playbook with a finding template, and a
  credible references list.
- **Project docs** — README with screenshot, `SECURITY.md`, `CONTRIBUTING.md`,
  MIT `LICENSE`, and a GitHub CI check that validates JSON and JS syntax.

### Security
- Repository contains documentation only — no exploit code, secrets, or
  organization-specific data. `.gitignore` blocks common secret/artifact patterns.
