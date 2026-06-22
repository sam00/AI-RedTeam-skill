# Domain: Identity — Okta / SSO (SAML, OIDC, MFA)

> Authorized testing only. Identity providers are high-value: compromise often
> grants access to every federated application. Confirm IdP testing is in scope.

## Tooling quick reference

| Tool | Purpose | Install |
|------|---------|---------|
| evilginx2 | AiTM phishing / session-token capture (authorized phishing sims) | https://github.com/kgretzky/evilginx2 |
| Okta API / okta-cli | Tenant enumeration with valid token | https://developer.okta.com/ |
| ROADtools / AADInternals | Entra ID federation analysis | github |
| BloodHound (Azure) | Cloud identity attack paths | SpecterOps |
| SAML Raider (Burp ext) | SAML message tampering | Burp BApp store |
| jwt_tool | OIDC/JWT token analysis | https://github.com/ticarpi/jwt_tool |

## Phase: Reconnaissance

| Technique | ATT&CK | Tools |
|-----------|--------|-------|
| Discover tenant/org & login realm | T1590, T1087 | `companyname.okta.com`, OpenID config |
| User/email enumeration | T1589.002 | login error timing/messages |
| Identify SSO apps & flows (SAML/OIDC) | T1592 | metadata endpoints |
| MFA factor discovery | T1589 | login flow inspection |

- **Recommendation:** uniform login error messages, disable user enumeration,
  hide tenant details. Ref: OWASP ASVS; Okta security docs.

## Phase: Initial Access / Credential Access

| Technique | ATT&CK | Recommendation |
|-----------|--------|----------------|
| Password spraying against Okta | T1110.003 | Rate limit, lockout, ThreatInsight, MFA |
| AiTM phishing → session cookie theft | T1557, T1539 | Phishing-resistant MFA (FIDO2/WebAuthn) |
| MFA fatigue / push bombing | T1621 | Number matching, push limits, FastPass |
| SMS/OTP interception & SIM swap | T1111 | Prefer FIDO2 over SMS/TOTP |
| Help-desk social engineering (factor reset) | T1556 | Strong identity-proofing for resets |
| OAuth consent phishing (illicit grant) | T1528 | App allow-listing, restrict consent |

**Steps (AiTM session theft concept — authorized phishing sim only):**
1. Stand up an authorized reverse-proxy phishing infra (e.g., evilginx2) in a
   controlled exercise with consent.
2. Target user authenticates through the proxy; the session token/cookie is
   captured, bypassing MFA at that moment.
3. Replay the session to access federated apps.
- **Recommendation:** **phishing-resistant MFA (FIDO2/WebAuthn/Okta FastPass)**,
  bind sessions to device, short session lifetimes, impossible-travel detection.
  Ref: CISA phishing-resistant MFA; Okta security best practices.

## Phase: Token / Federation Abuse

| Technique | ATT&CK | Recommendation |
|-----------|--------|----------------|
| SAML assertion tampering | T1606.002 | Validate signatures, audience, recipient |
| Golden SAML (signing key theft) | T1606.002 | Protect IdP signing keys (Tier 0/HSM) |
| OIDC token replay / weak validation | T1550 | Validate iss/aud/exp/nonce, short TTL |
| API token theft (SSWS/OAuth) | T1528 | Scope tokens, rotate, network-restrict |
| Inbound/cross-org federation abuse | T1199 | Review federation trusts, partner scoping |

## Phase: Persistence / Privilege Escalation

| Technique | ATT&CK | Recommendation |
|-----------|--------|----------------|
| Create rogue admin / API token | T1098 | Alert on admin & token creation |
| Add backdoor IdP/federation | T1556.007 | Monitor federation & policy changes |
| Weaken/remove MFA policy | T1556 | Change-control & alerting on auth policies |
| Skeleton-key app / service account | T1098 | Review app grants & service accounts |

- **Recommendation:** least-privilege admin roles, log to SIEM (Okta System
  Log), alert on policy/admin/token changes, enforce Conditional/Adaptive
  Access. Ref: Okta security; MITRE ATT&CK identity techniques.

## Cross-references
- Federation to AD/cloud: `domains/hybrid-infrastructure.md`
- Phishing delivery: `domains/social-engineering.md`
- Frameworks/fixes/citations: `frameworks/`, `recommendations/`
