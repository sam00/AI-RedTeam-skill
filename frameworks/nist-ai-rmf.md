# Framework: NIST AI Risk Management Framework (AI RMF 1.0)

Source: https://www.nist.gov/itl/ai-risk-management-framework
(+ Generative AI Profile, NIST AI 600-1)

The AI RMF organizes trustworthy-AI work into four functions. For red teaming,
they frame the engagement lifecycle and how findings drive risk decisions.

| Function | Purpose | Red-team application |
|----------|---------|----------------------|
| **Govern** | Culture, policy, accountability, roles | Confirm authorization, ROE, escalation, legal review; define risk tolerance |
| **Map** | Context, intended use, data, tools, failure modes | Inventory model/app/agent surface, data sources, tool permissions; define what "failure" means |
| **Measure** | Analyze, test, track metrics | Run adversarial tests; quantify attack success rate, severity, exposure |
| **Manage** | Prioritize, respond, monitor | Remediate by priority, re-test, monitor in production |

## Mapping to this skill's operating model

| Skill stage | NIST AI RMF |
|-------------|-------------|
| Govern & Map | Govern + Map |
| Adversarial Testing | Measure |
| Evaluate & Remediate | Measure + Manage |

## Trustworthiness characteristics to probe
Valid & reliable, safe, secure & resilient, accountable & transparent,
explainable & interpretable, privacy-enhanced, fair (bias managed). Red-team
findings should note which characteristic is degraded by each issue.

## How to use
Use NIST AI RMF to structure the **engagement** and **reporting**; use OWASP LLM
Top 10 + MITRE ATLAS to classify **individual findings**. See
`domains/ai-llm-security.md`.
