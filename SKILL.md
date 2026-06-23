---
name: ai-redteam
description: >-
  Offensive-security red team knowledge base and planning assistant. Use when a
  security engineer needs to plan, scope, or document an authorized red team
  engagement across application security, cloud (AWS, GCP, hybrid), Kubernetes,
  identity (Okta/SSO), social engineering (vishing, malicious chatbots), and
  AI/LLM systems. Provides offensive techniques mapped to MITRE ATT&CK, MITRE
  ATLAS, OWASP Top 10, OWASP LLM Top 10, and NIST AI RMF, with recommended
  tools and remediation guidance plus credible references. Documentation and
  planning only — this skill never executes attacks, scans, or exploits.
license: MIT
---

# AI Red Team Skill

A lightweight, framework-mapped offensive-security knowledge base for authorized
red team engagements, built around the **AI Red Team engineer** approach. This
file is a **router**: read only the domain or framework file you need to keep
context usage minimal (progressive disclosure).

> **Start here for methodology:** `domains/ai-red-team-engineer.md` — the AI Red
> Team engineer's role, approach, the AI systems/attacker models used, tooling,
> and engagement workflow. To author or extend this skill, see
> `guides/authoring-skills.md`.

## Scope & Safety (read first)

- **Authorized engagements only.** Confirm written authorization (rules of
  engagement, scope, timeboxes) exists before using any technique here.
- **This skill does not execute anything.** It produces plans, technique
  references, tool command templates, framework mappings, and remediation
  write-ups. It never scans, exploits, or touches live systems.
- **No secrets in outputs.** Never embed real credentials, tokens, customer
  data, or org-specific identifiers in deliverables.
- Defensive/remediation guidance is included so every finding ships with a fix.

## Operating model (NIST AI RMF + OWASP GenAI lifecycle)

1. **Govern & Map** — confirm authorization, define intended use, data flows,
   integrated tools, and what counts as a failure (e.g., cross-tenant data
   leak, unsafe tool action, privilege escalation).
2. **Adversarial Testing** — select techniques per domain, map to frameworks,
   record evidence.
3. **Evaluate & Remediate** — score findings, map to a framework, attach a
   recommendation + reference, prioritize remediation.

## Routing table — load only what you need

| If the task involves...                          | Read this file |
|--------------------------------------------------|----------------|
| AI red team approach, models used, methodology   | `domains/ai-red-team-engineer.md` |
| Hardest engagement challenges & solutions (2025–26)| `guides/engagement-playbooks.md` |
| Web/API/mobile app testing                       | `domains/application-security.md` |
| AWS accounts, IAM, S3, EKS, Lambda               | `domains/cloud-aws.md` |
| GCP projects, IAM, GCS, GKE, service accounts    | `domains/cloud-gcp.md` |
| On-prem + cloud, AD↔cloud trust, pivoting        | `domains/hybrid-infrastructure.md` |
| Kubernetes clusters, containers, supply chain    | `domains/kubernetes.md` |
| Okta, SSO, SAML/OIDC, MFA, IdP abuse             | `domains/identity-okta.md` |
| Vishing, phishing, malicious chatbots, pretext   | `domains/social-engineering.md` |
| LLM apps, agents, RAG, prompt injection          | `domains/ai-llm-security.md` |
| Active Directory graph / attack paths            | `domains/hybrid-infrastructure.md` (BloodHound) |

### Framework references (load when mapping findings)

| Framework                     | File |
|-------------------------------|------|
| MITRE ATT&CK (enterprise)     | `frameworks/mitre-attack.md` |
| MITRE ATLAS (AI systems)      | `frameworks/mitre-atlas.md` |
| OWASP Top 10 (web)            | `frameworks/owasp-top10.md` |
| OWASP LLM Top 10 (2025)       | `frameworks/owasp-llm-top10.md` |
| NIST AI RMF                   | `frameworks/nist-ai-rmf.md` |
| Cross-mapping matrix          | `frameworks/mapping-matrix.md` |

### Output helpers

| Need                                  | File |
|---------------------------------------|------|
| Per-finding remediation playbook      | `recommendations/remediation-playbook.md` |
| Credible references & citations       | `recommendations/references.md` |
| Finding write-up template             | `recommendations/remediation-playbook.md` (Finding template) |
| Author / extend skills & playbooks    | `guides/authoring-skills.md` |
| Solve the hardest engagement challenges| `guides/engagement-playbooks.md` |

### Structured data (single source of truth, also powers the UI)

- `data/techniques.json` — techniques with domain, phase, framework IDs, tools.
- `data/tools.json` — tool catalog (purpose, domain, install, references).
- `data/mappings.json` — kill-chain phases ↔ framework crosswalk.

## How to produce a finding

1. Identify the domain → read that `domains/*.md`.
2. Pick the technique; note its **kill-chain phase** and **framework IDs**.
3. Use the **Finding template** in `recommendations/remediation-playbook.md`.
4. Attach a **recommendation** + at least one **credible reference** from
   `recommendations/references.md`.
5. If client-facing, render/triage in the UI (`ui/index.html`).

## The UI

A dependency-free static web app for browsing techniques and mapping them to
frameworks lives in `ui/`. It reads `data/*.json`. Run locally, in Docker, or
in Kubernetes — see `deploy/README.md`.

## Engagement phases (universal)

Recon → Initial Access → Execution → Persistence → Privilege Escalation →
Defense Evasion → Credential Access → Discovery → Lateral Movement →
Collection → Exfiltration → Impact → Reporting.

AI/agent engagements add: Model/Tool Discovery → Prompt Injection →
Jailbreak/Guardrail Bypass → Tool/Plugin Abuse → Data/Model Exfiltration.
