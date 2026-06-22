# Framework: OWASP Top 10 (Web Application Security Risks, 2021)

Source: https://owasp.org/Top10/

| ID | Risk | Red-team focus | Primary fix |
|----|------|----------------|-------------|
| A01 | Broken Access Control | IDOR, path/role bypass, BOLA | Server-side authz, deny by default |
| A02 | Cryptographic Failures | Weak/missing crypto, secrets in transit/rest | Strong TLS, proper key mgmt, no plaintext secrets |
| A03 | Injection | SQLi, NoSQLi, cmd, XSS | Parameterization, encoding, allow-lists |
| A04 | Insecure Design | Missing threat modeling, logic flaws | Threat modeling, secure design patterns |
| A05 | Security Misconfiguration | Default creds, verbose errors, XXE | Hardening baselines, disable unused features |
| A06 | Vulnerable & Outdated Components | Old libs/frameworks | SCA, patching, SBOM |
| A07 | Identification & Authentication Failures | Weak auth, session flaws | MFA, secure sessions, lockout |
| A08 | Software & Data Integrity Failures | Insecure deserialization, unsigned updates | Integrity checks, signed artifacts |
| A09 | Security Logging & Monitoring Failures | No/insufficient logging | Centralized logging, alerting |
| A10 | Server-Side Request Forgery (SSRF) | Internal/metadata access | Egress allow-list, block link-local, IMDSv2 |

## Related OWASP lists used in this skill
- **OWASP API Security Top 10** — see `domains/application-security.md` (API1–API10).
- **OWASP MASVS/MASTG** (mobile) — see `domains/application-security.md`.
- **OWASP ASVS** — verification standard for fixes/recommendations.

## How to use
Tag each web/API finding with the matching `Axx` (and API/MASVS where relevant),
then add the recommendation from `recommendations/remediation-playbook.md`.
