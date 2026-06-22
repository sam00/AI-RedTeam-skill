# The AI Red Team Engineer — Role, Approach & Models

> The "engineer's manual" for this skill. Read this first if you are scoping an
> **AI red team** engagement or want the methodology behind the technique files.
> Authorized engagements only; documentation and planning, never live attacks.

## 1. What an AI Red Team engineer does

An AI Red Team engineer **emulates adversaries against AI-enabled systems** to
find security and safety failures *before* attackers (or accidents) do. The role
sits at the intersection of three disciplines:

- **Offensive security** — classic attacker tradecraft (recon → impact).
- **ML/AI engineering** — how models, RAG, agents, and MLOps actually work.
- **AI safety/assurance** — harmful, biased, or untrustworthy behavior.

It differs from a **classic red team** (which targets networks/apps/people) by
adding the **model and its data/agency** as first-class attack surface, and from
a pure **safety evaluation** by using an **adversarial, goal-driven** approach.

> An AI red team engineer still needs the traditional domains in this skill: the
> infrastructure *around* the model (cloud, K8s, identity, app) is part of the
> AI system's attack surface. See the routing table in `SKILL.md`.

## 2. Approach (methodology)

Aligned to **NIST AI RMF** and the **OWASP GenAI Red Teaming** lifecycle.

### Stage 1 — Govern & Map
- Confirm **authorization**, rules of engagement, timeboxes, and safe-handling
  rules for any sensitive output discovered.
- **Map the system**: intended use, users/tenants, the model(s), data sources
  (training data, RAG corpora), integrated **tools/plugins**, the identities and
  permissions the system can act as ("blast radius"), and trust boundaries.
- Define **failure modes** explicitly (what counts as a finding): cross-user/PII
  leakage, unsafe tool action, training-data extraction, harmful content,
  guardrail bypass, cost/DoS, misinformation, supply-chain compromise.

### Stage 2 — Adversarial Testing
- Choose **technique categories** (see `domains/ai-llm-security.md`) and an
  **attack model** (Section 4).
- Run **manual probes** + **automated red-team tooling**; capture prompt/response
  evidence (defanged, no real secrets).
- Test **single-turn** and **multi-turn** (conversational) attacks; chain across
  the surrounding infrastructure where in scope.

### Stage 3 — Evaluate & Remediate
- Score each finding (severity, exposure, exploitability), **map to ATLAS +
  OWASP LLM Top 10 + NIST AI RMF**, attach a **recommendation + credible
  reference**.
- Track metrics (attack success rate per category), prioritize fixes, and
  **re-test** after remediation. See `recommendations/remediation-playbook.md`.

## 3. Models used (target attack surface)

"Models used" in two senses. First, the **AI systems you test**:

| Target type | What you attack | Primary risks (OWASP LLM) |
|-------------|-----------------|---------------------------|
| Foundation / hosted LLM | Prompts, guardrails, content policy | LLM01, LLM02, LLM07, LLM09 |
| Fine-tuned / custom model | Training data, behavior drift, backdoors | LLM04, LLM02 |
| RAG system | Retrieval corpus, vector DB, chunk authz | LLM01, LLM02, LLM08 |
| Agentic / tool-using system | Tools, plugins, actions, autonomy | LLM06, LLM01, LLM05 |
| Multimodal (image/audio/doc) | Cross-modal & indirect injection | LLM01, LLM05 |
| Embeddings / vector store | Tenant isolation, inversion | LLM08, LLM02 |
| Guardrail / classifier layer | Evasion of safety filters | LLM01 |
| MLOps / supply chain | Model registry, plugins, dependencies | LLM03, LLM04 |

## 4. Attacker models (how you test)

Second sense of "models used" — the **adversary/attack models** you adopt:

- **Access model:** black-box (API only), gray-box (some internals/docs),
  white-box (weights/code). State it in scope; it changes feasible techniques.
- **Threat-actor profile:** external user, malicious insider, compromised
  supply-chain, or a hostile data source (indirect injection).
- **Manual vs automated:**
  - *Manual* — human-crafted jailbreaks, logic abuse, creative pretexts.
  - *Automated* — an **attacker LLM** generates/evolves adversarial prompts at
    scale (e.g., PyRIT, Garak, Promptfoo, deepteam); good for coverage and
    regression.
- **Turn structure:** single-turn vs **multi-turn** (e.g., gradual escalation /
  "crescendo", role-play, context-stuffing) — multi-turn often beats filters.
- **Maturity/threat frameworks:** **MITRE ATLAS** (TTPs), **OWASP LLM Top 10
  2025** (risks), **NIST AI RMF** (governance/metrics), **OWASP GenAI Red
  Teaming Guide** and **Microsoft AI Red Team** (process).

## 5. Tooling stack

| Tool | Use | Reference |
|------|-----|-----------|
| Microsoft PyRIT | Orchestrate automated, multi-turn AI red-teaming | https://github.com/Azure/PyRIT |
| NVIDIA Garak | LLM vulnerability scanner (probes) | https://github.com/NVIDIA/garak |
| Promptfoo | Red-team + eval, regression in CI | https://www.promptfoo.dev/ |
| deepteam | LLM red-teaming framework | https://github.com/confident-ai/deepteam |
| NIST Dioptra | Adversarial ML testbed | https://github.com/usnistgov/dioptra |
| Counterfit | Automated ML attacks | https://github.com/Azure/counterfit |
| ARTEMIS | AI red-team framework | https://github.com/Stanford-Trinity/ARTEMIS |
| ART | Adversarial ML attacks/defenses | https://github.com/Trusted-AI/adversarial-robustness-toolbox |

Details and step-by-step tests: `domains/ai-llm-security.md`.

## 6. Failure-mode catalog (quick map)

Prompt injection (LLM01) · Sensitive disclosure (LLM02) · Supply chain (LLM03) ·
Data/model poisoning (LLM04) · Improper output handling (LLM05) · Excessive
agency (LLM06) · System-prompt leakage (LLM07) · Vector/embedding weaknesses
(LLM08) · Misinformation (LLM09) · Unbounded consumption (LLM10). Each maps to a
MITRE ATLAS technique — see `frameworks/owasp-llm-top10.md`.

## 7. Deliverables & metrics
- Findings (template in `recommendations/remediation-playbook.md`), each with
  framework mapping + recommendation + reference.
- **Metrics:** attack success rate per category, severity distribution, exposure
  (data/agency/cost), remediation status, re-test results.
- Executive summary framed by NIST AI RMF functions.

## 8. Competencies of the engineer
Offensive fundamentals (ATT&CK), LLM/agent architecture literacy, prompt-craft,
scripting/automation (PyRIT/Promptfoo), cloud + identity + K8s basics (the AI
system's surroundings), and clear, responsible reporting.

## 9. How to extend this skill
To add new techniques, tools, or your own playbooks, follow
`guides/authoring-skills.md` (keeps the skill lightweight and the UI in sync).

## Cross-references
- AI technique detail & tests: `domains/ai-llm-security.md`
- Frameworks: `frameworks/mitre-atlas.md`, `frameworks/owasp-llm-top10.md`, `frameworks/nist-ai-rmf.md`
- Findings & references: `recommendations/`
