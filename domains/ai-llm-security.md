# Domain: AI / LLM Security (Prompt Injection, Jailbreaks, RAG, Agents)

> Authorized AI red teaming only. Test models/apps/agents you are authorized to
> assess. Map findings to **OWASP LLM Top 10 (2025)** and **MITRE ATLAS**, and
> follow the **NIST AI RMF / OWASP GenAI** lifecycle (Govern & Map → Adversarial
> Testing → Evaluate & Remediate).

## Operating model (do this first)

1. **Govern & Map** — document the system's intended use, data sources
   (training, RAG corpus), integrated tools/plugins, identities the agent can
   act as, and **defined failure modes** (cross-user data leak, unsafe tool
   action, training-data extraction, harmful content, cost/DoS).
2. **Adversarial Testing** — run technique categories below; capture prompts +
   responses as evidence.
3. **Evaluate & Remediate** — score severity, map to framework IDs, attach
   recommendation + reference, prioritize fixes before production.

## Tooling quick reference

| Tool | Purpose | Install |
|------|---------|---------|
| Promptfoo | Automated LLM red-team / eval (jailbreaks, PII, etc.) | https://www.promptfoo.dev/ |
| NVIDIA Garak | LLM vulnerability scanner | https://github.com/NVIDIA/garak |
| Microsoft PyRIT | AI red-team orchestration | https://github.com/Azure/PyRIT |
| deepteam (Confident AI) | LLM red-teaming framework | https://github.com/confident-ai/deepteam |
| NIST Dioptra | Adversarial ML testbed | https://github.com/usnistgov/dioptra |
| Counterfit | Automated ML attack tool | https://github.com/Azure/counterfit |
| ARTEMIS (Stanford-Trinity) | AI red-team framework | https://github.com/Stanford-Trinity/ARTEMIS |
| Adversarial Robustness Toolbox (ART) | Adversarial ML attacks/defenses | https://github.com/Trusted-AI/adversarial-robustness-toolbox |

## Technique categories (mapped)

| Technique | ATLAS | OWASP LLM 2025 | Tools | Recommendation |
|-----------|-------|----------------|-------|----------------|
| Direct prompt injection / jailbreak | AML.T0051.000 | LLM01 | promptfoo, garak, deepteam | Input/instruction separation, guardrail classifiers, refuse-and-log |
| Indirect prompt injection (RAG/web/email content) | AML.T0051.001 | LLM01 | promptfoo, manual | Treat retrieved content as untrusted, content sanitization, provenance |
| System prompt extraction/leakage | AML.T0056 | LLM07 | garak, manual | Don't put secrets in system prompt; assume it leaks |
| Sensitive info / PII disclosure | AML.T0057 | LLM02 | promptfoo, garak | Output filtering, data minimization, per-user authz on retrieval |
| Training-data extraction / membership inference | AML.T0024, AML.T0048 | LLM02 | ART, manual | Dedup/scrub PII, DP training, rate limits |
| Model theft / extraction | AML.T0044, AML.T0048.004 | LLM10 | manual, ART | Rate/quotas, watermarking, monitor cloning patterns |
| Data/model poisoning (incl. RAG corpus) | AML.T0020, AML.T0018 | LLM04 | manual, ART | Vet data sources, signing, provenance, anomaly detection |
| Vector/embedding weaknesses (RAG) | AML.T0051.001 | LLM08 | manual | Tenant isolation in vector DB, access control on chunks |
| Improper output handling (XSS/SSRF/SQLi via LLM output) | AML.T0050 | LLM05 | Burp + LLM | Treat LLM output as untrusted; encode/validate downstream |
| Excessive agency / unsafe tool actions | AML.T0053 | LLM06 | manual, PyRIT | Least-privilege tools, HITL approval, action allow-lists |
| Supply chain (model/plugin/dependency) | AML.T0010 | LLM03 | trivy, manual | Verify model/plugin provenance, pin & scan deps |
| Unbounded consumption / cost & DoS | AML.T0034, AML.T0029 | LLM10 | promptfoo (load) | Rate limits, token/cost budgets, timeouts, quotas |
| Misinformation / unsafe overreliance | — | LLM09 | manual eval | Grounding/citations, confidence signals, human review |
| Evasion of safety classifiers | AML.T0015, AML.T0043 | LLM01 | garak, PyRIT | Layered defenses, adversarial training, red-team continuously |

## Step-by-step: core tests (documentation/templates only)

### 1. Direct prompt injection / jailbreak (LLM01, AML.T0051.000)
1. Define disallowed behavior (e.g., reveal system prompt, produce restricted
   content, call a privileged tool).
2. Use a framework to generate adversarial prompts at scale:
   `promptfoo redteam run` or `python -m garak --model_type ... --probes ...`
3. Record any successful bypass with the exact prompt + response as evidence.
- **Recommendation:** separate trusted instructions from user input, add input
  and output guardrail classifiers, fail closed, log/refuse. Ref: OWASP LLM01;
  MITRE ATLAS AML.T0051.

### 2. Indirect prompt injection via RAG/tool content (LLM01, AML.T0051.001)
1. Identify a content source the model ingests (document, webpage, email,
   ticket) that an attacker could influence.
2. Plant benign-but-instructional test content (e.g., "ignore prior rules…") in
   a controlled record.
3. Observe whether the model follows injected instructions or exfiltrates data.
- **Recommendation:** treat all retrieved/tool content as untrusted data, not
  instructions; sanitize, sandbox, and constrain tool permissions. Ref: OWASP
  LLM01/LLM08.

### 3. Sensitive info & cross-user leakage (LLM02, AML.T0057)
1. As user A, attempt to retrieve data belonging to user B via prompts or RAG.
2. Probe for PII/secret regurgitation.
- **Recommendation:** enforce per-user authorization on retrieval and tools,
  output PII filtering, data minimization. Ref: OWASP LLM02.

### 4. Excessive agency / unsafe tool use (LLM06, AML.T0053)
1. Enumerate the agent's tools/permissions (the "blast radius").
2. Attempt to induce a harmful action (delete, transfer, email, code exec) via
   crafted input.
- **Recommendation:** least-privilege tools, human-in-the-loop for sensitive
  actions, allow-list actions, scoped credentials. Ref: OWASP LLM06.

### 5. Unbounded consumption (LLM10, AML.T0034)
1. Send expensive/looping requests to measure cost & latency impact.
2. Test for model-cloning via high-volume query patterns.
- **Recommendation:** rate limits, per-user token/cost budgets, timeouts,
  circuit breakers. Ref: OWASP LLM10.

## Evaluation & metrics
Track: attack success rate per category, severity, exposure (data/agency/cost),
and remediation status. Re-test after fixes. Ref: NIST AI RMF Measure/Manage;
OWASP GenAI Red Teaming Guide.

## Cross-references
- Org chatbot SE angle: `domains/social-engineering.md`
- Frameworks: `frameworks/owasp-llm-top10.md`, `frameworks/mitre-atlas.md`, `frameworks/nist-ai-rmf.md`
- Fixes/citations: `recommendations/remediation-playbook.md`, `recommendations/references.md`
