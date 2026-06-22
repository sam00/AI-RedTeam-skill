# Remediation Playbook & Finding Template

Every finding produced with this skill must include a **recommendation** and at
least one **credible reference** (`recommendations/references.md`).

## Finding template (copy/paste)

```markdown
### [ID] Title
- **Severity:** Critical | High | Medium | Low | Info  (+ CVSS if applicable)
- **Domain:** application-security | cloud-aws | cloud-gcp | hybrid | kubernetes | identity-okta | social-engineering | ai-llm
- **Kill-chain phase:** recon | initial-access | execution | persistence | priv-esc | defense-evasion | cred-access | discovery | lateral-movement | collection | exfiltration | impact
- **Framework mapping:**
  - ATT&CK: Txxxx
  - ATLAS: AML.Txxxx (AI only)
  - OWASP: Axx / APIx / LLMxx:2025
  - NIST AI RMF: Govern/Map/Measure/Manage (AI only)
- **Description:** What the issue is, in plain language.
- **Impact:** What an attacker achieves (data/agency/cost/access).
- **Evidence:** Defanged steps/screens/logs; no secrets or real customer data.
- **Recommendation:** Specific, actionable fix(es), prioritized.
- **References:** [keys from references.md]
- **Status:** Open | Remediated | Risk-accepted | Re-test pending
```

## Severity guidance
- **Critical** — full compromise (domain admin, cloud org takeover, RCE, mass
  data exfil, agent performs destructive action).
- **High** — significant access/data exposure or privilege escalation.
- **Medium** — meaningful weakness requiring conditions/chaining.
- **Low/Info** — hardening/best-practice gaps.

## Recommendation patterns by theme

| Theme | Standard recommendation | Reference keys |
|-------|------------------------|----------------|
| Access control / authz | Deny by default, server-side checks per object/function, least privilege | owasp-top10, owasp-asvs |
| Injection | Parameterize, encode output, allow-list input, least-priv data access | owasp-top10 |
| SSRF / metadata | Egress allow-list, block link-local, enforce IMDSv2 / GCP metadata controls | owasp-top10, aws-imdsv2, hacktricks-gcp |
| Cloud IAM privesc | Least privilege, constrain PassRole/actAs, disable SA key creation, SCP/Org Policy | aws-iam, gcp-iam, pmapper, hacktricks-gcp |
| Logging/monitoring | Centralized immutable logs, protect/alert on disablement | owasp-top10, aws-sra |
| Kubernetes | Pod Security Admission (restricted), drop caps, no hostPath/socket, NetworkPolicy, admission control | k8s-pss, cis-k8s |
| Identity/MFA | Phishing-resistant MFA (FIDO2), session binding, strong reset proofing, alert on policy/admin changes | cisa-mfa, okta-sec |
| Federation / SAML | Protect token-signing keys (Tier 0/HSM), validate assertions, rotate | mitre-attack, cisa |
| Social engineering | Awareness training, callback verification, dual control, DMARC/DKIM/SPF | cisa-phishing, nist-800-53 |
| Prompt injection (LLM01) | Separate instructions/data, input+output guardrails, fail closed, treat retrieved content as untrusted | owasp-llm, atlas, ms-airt |
| Sensitive disclosure (LLM02) | Per-user authz on retrieval, output PII filtering, data minimization | owasp-llm |
| Excessive agency (LLM06) | Least-privilege tools, human-in-the-loop, action allow-lists, scoped creds | owasp-llm |
| Supply chain (LLM03/A06) | Verify provenance, sign artifacts, pin & scan deps, SBOM | owasp-llm, slsa |
| Unbounded consumption (LLM10) | Rate limits, token/cost budgets, timeouts, circuit breakers | owasp-llm |

## Remediation workflow
1. Triage by severity + exploitability + business impact.
2. Assign owner + due date; track status in the finding.
3. Apply fix; **re-test** to confirm closure.
4. Add a detection/monitoring control where feasible (shift left + detect).
5. Capture lessons for secure-design backlog (OWASP A04 / NIST Govern).

## Reporting structure (engagement-level, NIST AI RMF aligned)
1. Executive summary (risk posture, top themes).
2. Scope, authorization, methodology, frameworks used.
3. Findings (template above), grouped by severity/domain.
4. Strategic recommendations & roadmap.
5. Appendices: tooling, references, re-test results.
