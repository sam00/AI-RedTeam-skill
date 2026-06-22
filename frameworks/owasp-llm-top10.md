# Framework: OWASP Top 10 for LLM Applications (2025)

Source: https://genai.owasp.org/llm-top-10/

| ID | Risk | Red-team focus | ATLAS | Primary fix |
|----|------|----------------|-------|-------------|
| LLM01:2025 | Prompt Injection | Direct & indirect injection, jailbreaks | AML.T0051 | Separate instructions/data, guardrails, fail closed |
| LLM02:2025 | Sensitive Information Disclosure | PII/secret leakage, cross-user data | AML.T0057 | Output filtering, per-user authz, data minimization |
| LLM03:2025 | Supply Chain | Malicious model/plugin/dependency | AML.T0010 | Verify provenance, pin & scan, signing |
| LLM04:2025 | Data and Model Poisoning | Training/RAG corpus poisoning, backdoors | AML.T0020 | Vet sources, provenance, anomaly detection |
| LLM05:2025 | Improper Output Handling | LLM output → XSS/SSRF/SQLi/RCE downstream | AML.T0050 | Treat output as untrusted; encode/validate |
| LLM06:2025 | Excessive Agency | Unsafe tool/plugin actions, over-permission | AML.T0053 | Least-privilege tools, HITL, action allow-lists |
| LLM07:2025 | System Prompt Leakage | Extracting hidden instructions/secrets | AML.T0056 | No secrets in prompts; assume leakage |
| LLM08:2025 | Vector and Embedding Weaknesses | RAG/vector-DB tenant bleed, manipulation | AML.T0051.001 | Tenant isolation, access control on chunks |
| LLM09:2025 | Misinformation | Hallucination, unsafe overreliance | — | Grounding/citations, human review |
| LLM10:2025 | Unbounded Consumption | Cost/DoS, model extraction | AML.T0034 / T0048 | Rate limits, budgets, timeouts, quotas |

## How to use
Every AI/LLM finding gets an `LLMxx:2025` tag **plus** an ATLAS technique. Detail
and step-by-step tests live in `domains/ai-llm-security.md`. Lifecycle/governance
is in `frameworks/nist-ai-rmf.md`.

## Related
- OWASP GenAI Red Teaming Guide & Agentic threats: https://genai.owasp.org/
