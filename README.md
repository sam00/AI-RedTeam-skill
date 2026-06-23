# AI Red Team Skill

> A lightweight, framework-mapped **offensive-security knowledge base** and
> planning assistant for authorized red team engagements — plus a dependency-free
> **web UI** for mapping techniques to MITRE, OWASP, and NIST frameworks.

**Documentation & planning only.** This project does **not** scan, exploit, or
attack anything. It is a reference + UI you share with security engineers to
plan engagements and write findings consistently.

**[▶ Live demo](https://sam00.github.io/AI-RedTeam-skill/ui/)** · **[Methodology](domains/ai-red-team-engineer.md)** · **[Engagement playbooks (2025–26)](guides/engagement-playbooks.md)**

![AI Red Team Skill — technique & framework mapper UI](docs/screenshot.png)

---

## Why use this?

**The problem it solves.** Red-team findings get written inconsistently and
drift away from recognized frameworks. This skill is one catalog where every
technique is pre-mapped to MITRE ATT&CK, MITRE ATLAS, OWASP, OWASP LLM Top 10,
and NIST AI RMF — plus a zero-build web UI to filter, map, and export a
findings draft in minutes.

**60-second quickstart.**
```bash
git clone https://github.com/sam00/AI-RedTeam-skill.git
cd AI-RedTeam-skill
python3 -m http.server 8080      # then open http://localhost:8080/ui/
```
No install? **[Try the live demo →](https://sam00.github.io/AI-RedTeam-skill/ui/)**

**Example output.** Pick a domain (e.g. *AI / LLM Security*) and a technique;
the UI shows its framework mappings, a remediation recommendation, and a
credible reference, then exports a Markdown findings draft you paste straight
into your report. (See the UI screenshot above.)

**Who it's for.** Red teamers, penetration testers, AI red teamers / AI
assurance engineers, and blue teamers who want a shared framework vocabulary.

**What it is *not*.** Not a scanner and not an exploit kit — it does **not**
touch, probe, or attack any system. It is documentation, planning, and
reporting material for **authorized** engagements only.

---

## What's inside

| Area | Coverage |
|------|----------|
| **AI Red Team methodology** | Engineer role, approach, AI/attacker models used, tooling, workflow |
| **Application Security** | Web, API, mobile, auth, injection, SSRF, deserialization |
| **Cloud — AWS** | IAM, S3, STS, Lambda, EKS, metadata abuse, privesc |
| **Cloud — GCP** | IAM, service accounts, GCS, GKE, metadata, privesc |
| **Hybrid Infrastructure** | AD↔cloud trust, pivoting, BloodHound attack paths |
| **Kubernetes** | RBAC, pod escapes, secrets, supply chain |
| **Identity — Okta / SSO** | SAML/OIDC abuse, MFA fatigue, session theft, IdP federation |
| **Social Engineering** | Vishing, phishing, pretexting, malicious chatbots |
| **AI / LLM Security** | Prompt injection, jailbreaks, RAG poisoning, agent/tool abuse |
| **Engagement playbooks (2025–26)** | EDR/XDR evasion, MFA-protected identity compromise, cloud privesc, zero-trust lateral movement, OPSEC, business-impact, purple team |

Every technique is mapped to **MITRE ATT&CK**, **MITRE ATLAS**, **OWASP Top 10**,
**OWASP LLM Top 10 (2025)**, and **NIST AI RMF**, and ships with a **recommendation**
and **credible reference**.

**Start with the methodology:** [`domains/ai-red-team-engineer.md`](domains/ai-red-team-engineer.md)
explains the AI Red Team engineer's approach, the AI systems and attacker models
used, the tooling stack, and the engagement workflow. To author or extend the
skill, see [`guides/authoring-skills.md`](guides/authoring-skills.md).

**Solving the hardest 2025–26 challenges** — EDR/XDR evasion, MFA-protected
identity compromise, cloud privesc, zero-trust lateral movement, OPSEC, and
proving business impact: see
[`guides/engagement-playbooks.md`](guides/engagement-playbooks.md).

---

## Two ways to use it

### 1. As a Claude / AI agent Skill
Point your agent at this folder. `SKILL.md` is a **lightweight router** — the
agent loads only the domain/framework file it needs, keeping token usage low
(progressive disclosure). Works in any IDE that supports agent skills or simple
file context (Cursor, VS Code, Claude Desktop, Windsurf, etc.).

### 2. As a standalone mapping UI
A zero-build static web app in `ui/` lets engineers browse, filter, and map
techniques to frameworks, then export a findings draft. Reads `data/*.json`.

---

## Quick start

### Local (no dependencies)
```bash
# Python 3 (preinstalled on macOS/Linux; on Windows use "py -m")
cd ai-redteam-skill
python3 -m http.server 8080
# open http://localhost:8080/ui/
```
> Serve from the repo root and open the `/ui/` path so the app can load
> `data/*.json`. Docker/Compose/K8s serve the UI at the root (`/`).

### Docker
```bash
cd ai-redteam-skill
docker build -t ai-redteam-skill -f deploy/Dockerfile .
docker run --rm -p 8080:80 ai-redteam-skill
# open http://localhost:8080
```

### Docker Compose
```bash
cd ai-redteam-skill/deploy
docker compose up --build
```

### Kubernetes
```bash
kubectl apply -f deploy/k8s-deployment.yaml
kubectl port-forward svc/ai-redteam-skill 8080:80
```

See [`deploy/README.md`](deploy/README.md) for details and Windows notes.

---

## Repository layout

```
ai-redteam-skill/
├── SKILL.md                  # Lightweight router (agent entry point)
├── README.md
├── domains/                  # Methodology + offensive technique references
│   ├── ai-red-team-engineer.md   # AI Red Team engineer: approach, models, workflow
│   ├── application-security.md
│   ├── cloud-aws.md
│   ├── cloud-gcp.md
│   ├── hybrid-infrastructure.md
│   ├── kubernetes.md
│   ├── identity-okta.md
│   ├── social-engineering.md
│   └── ai-llm-security.md
├── frameworks/               # MITRE / OWASP / NIST references + crosswalk
│   ├── mitre-attack.md
│   ├── mitre-atlas.md
│   ├── owasp-top10.md
│   ├── owasp-llm-top10.md
│   ├── nist-ai-rmf.md
│   └── mapping-matrix.md
├── recommendations/          # Remediation playbook + references
│   ├── remediation-playbook.md
│   └── references.md
├── guides/                   # How-to guides
│   └── authoring-skills.md   # Write agent skills + technique playbooks
├── data/                     # Structured JSON (source of truth + UI feed)
│   ├── techniques.json
│   ├── tools.json
│   └── mappings.json
└── deploy/                   # Docker / Compose / K8s / nginx
    ├── Dockerfile
    ├── docker-compose.yml
    ├── k8s-deployment.yaml
    ├── nginx.conf
    └── README.md
```

---

## Frameworks & standards referenced

- [MITRE ATT&CK](https://attack.mitre.org/)
- [MITRE ATLAS](https://atlas.mitre.org/) (adversarial threats to AI systems)
- [OWASP Top 10](https://owasp.org/Top10/)
- [OWASP Top 10 for LLM Applications (2025)](https://genai.owasp.org/llm-top-10/)
- [OWASP GenAI Red Teaming Guide](https://genai.owasp.org/)
- [NIST AI Risk Management Framework (AI RMF 1.0)](https://www.nist.gov/itl/ai-risk-management-framework)
- [Microsoft AI Red Team](https://learn.microsoft.com/en-us/security/ai-red-team/)

Tooling ecosystems referenced (links in `recommendations/references.md`):
[Kali tools](https://www.kali.org/tools/), [BloodHound](https://github.com/SpecterOps/BloodHound),
[Promptfoo](https://www.promptfoo.dev/), [NIST Dioptra](https://github.com/usnistgov/dioptra),
[NVIDIA Garak](https://github.com/NVIDIA/garak), [Microsoft PyRIT](https://github.com/Azure/PyRIT),
[deepteam](https://github.com/confident-ai/deepteam).

---

## Responsible use

This material is for **authorized, ethical, offensive security work** —
penetration tests, red team engagements, and AI assurance — conducted with
explicit written permission. Misuse against systems you do not own or lack
authorization to test may be illegal. Contributors and maintainers assume no
liability for misuse. See [SECURITY & ethics notes in `CONTRIBUTING.md`](CONTRIBUTING.md).

## Related projects

Part of a small suite of local-first AI-security tools:

- **[AI-RedEye-harness](https://github.com/sam00/AI-RedEye-harness)** — Agentic SAST harness for AI-assisted vulnerability discovery with grounding, voting, SARIF, and CI/CD workflows.
- **[AI-TokenTrim](https://github.com/sam00/AI-TokenTrim)** — Local-first context compression for AI agents: cut LLM tokens, cost, and latency with reversible caching and MCP/proxy support.

## License

[MIT](LICENSE)
