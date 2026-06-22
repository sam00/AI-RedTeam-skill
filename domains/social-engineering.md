# Domain: Social Engineering (Vishing, Phishing, Malicious Chatbots)

> **Strict consent required.** Social engineering targets people. Run only with
> explicit written authorization, a defined target list, legal review, and a
> communications plan. Never target individuals outside scope; protect captured
> data; debrief participants per the rules of engagement.

## Tooling quick reference

| Tool | Purpose | Install |
|------|---------|---------|
| GoPhish | Phishing campaign framework | https://github.com/gophish/gophish |
| evilginx2 | AiTM session-capture (authorized sims) | https://github.com/kgretzky/evilginx2 |
| SET (Social-Engineer Toolkit) | Multi-vector SE simulations | kali default |
| theHarvester / Maltego | OSINT for pretext building | kali / paterva |
| SpiderFoot / recon-ng | Automated OSINT | github |
| Asterisk / SIP softphones | Vishing call infra (caller-ID research) | as authorized |

## Phase: Reconnaissance (OSINT)

| Technique | ATT&CK | Tools |
|-----------|--------|-------|
| Email & employee harvesting | T1589.002 | theHarvester, LinkedIn OSINT |
| Org/tech footprinting | T1591, T1593 | SpiderFoot, Maltego |
| Pretext development | T1598 | manual + OSINT |
| Phone number / org-chart mapping | T1589 | OSINT |

- **Recommendation:** reduce public exposure of org data, train staff on OSINT
  risk, monitor brand/domain impersonation. Ref: MITRE PRE-ATT&CK reconnaissance.

## Phase: Phishing (Email / Web)

| Technique | ATT&CK | Recommendation |
|-----------|--------|----------------|
| Credential-harvest phishing | T1566.002 | Phishing-resistant MFA, link rewriting, training |
| Attachment / macro lure | T1566.001 | Block macros, sandbox attachments, EDR |
| AiTM proxy phishing (MFA bypass) | T1557, T1566 | FIDO2/WebAuthn, session binding |
| Look-alike domains | T1583.001 | Domain monitoring, DMARC/DKIM/SPF |

**Steps (authorized phishing sim):**
1. Build pretext from OSINT; register/look-alike domain in a controlled lab.
2. Launch GoPhish campaign to the consented target list; track clicks/submits.
3. Report click/submit rates and report-rate; debrief.
- **Recommendation:** enforce DMARC/DKIM/SPF, mail filtering, user reporting
  button, phishing-resistant MFA, recurring awareness training. Ref: CISA
  phishing guidance; NIST 800-53 AT controls.

## Phase: Vishing (Voice)

| Technique | ATT&CK | Recommendation |
|-----------|--------|----------------|
| Help-desk impersonation (password/MFA reset) | T1598, T1656 | Strong caller identity-proofing, callback verification |
| IT-support pretext for remote access | T1566, T1219 | Verify before granting access, ban unsolicited remote tools |
| Caller-ID spoofing | T1656 | Out-of-band verification, STIR/SHAKEN awareness |
| Voice-clone / deepfake pretext | T1656 | Code-word verification, multi-party approval for sensitive actions |

**Steps (authorized vishing sim):**
1. Define call scripts, target roles, and success criteria with the client.
2. Place calls from authorized infra; attempt the agreed objective (e.g.,
   convince help-desk to reset a factor in a controlled test account).
3. Record outcomes (with consent) and procedural gaps; debrief.
- **Recommendation:** identity-proofing for resets, callback to known numbers,
  dual-control for high-risk actions, deepfake-aware verification (code words).
  Ref: CISA #StopRansomware help-desk advisories.

## Phase: Malicious / Abused Chatbots

Two angles: (a) attacker stands up a malicious chatbot to socially engineer
users; (b) a legitimate org chatbot/LLM assistant is abused to harm users.

| Technique | ATT&CK / ATLAS | OWASP LLM | Recommendation |
|-----------|----------------|-----------|----------------|
| Impersonation chatbot harvests creds/PII | T1598 | — | Verified channels, user education, brand monitoring |
| Prompt injection to make support bot leak data/act | AML.T0051 | LLM01, LLM02 | Input/output guardrails, least-privilege tools |
| Bot tricked into unsafe action (refunds, resets) | AML.T0053 | LLM06 | Human-in-the-loop, action allow-lists |
| Quishing / smishing to chatbot funnel | T1566 | — | Channel verification, link analysis |

- **Recommendation:** for org chatbots, apply the AI/LLM controls in
  `domains/ai-llm-security.md` (guardrails, least-privilege tools, HITL for
  sensitive actions, output filtering). For impersonation, monitor and take down
  look-alike bots/brands. Ref: OWASP GenAI; OWASP LLM Top 10 2025.

## Reporting note
Social-engineering results focus on **process and human-control gaps**, not
shaming individuals. Aggregate metrics; protect identities.

## Cross-references
- IdP/MFA controls: `domains/identity-okta.md`
- Org chatbot/LLM testing: `domains/ai-llm-security.md`
- Frameworks/fixes/citations: `frameworks/`, `recommendations/`
