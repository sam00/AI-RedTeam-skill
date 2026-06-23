# Engagement Playbooks — Solving the Hardest Red Team Challenges (2025–2026)

Practical, framework-mapped solutions for the problems that actually decide modern
engagements: proving **business impact** while staying **stealthy** and beating
**modern defenses** (EDR/XDR, Zero Trust, identity-centric environments, AI systems).

> **Documentation & planning only.** Authorized engagements with written scope and
> rules of engagement (RoE) only. Every play below is **defanged** — concepts,
> tooling names, OPSEC, detections, and impact framing, not working exploit code.
> Never include real credentials, customer data, or org-specific identifiers in
> deliverables. See `SECURITY.md` and `domains/ai-red-team-engineer.md`.

## How to use this guide

Each challenge follows the same template so you can lift it straight into a plan:

- **Challenge** — why it's hard today.
- **Approach** — how an operator actually solves it.
- **Key techniques** — defanged, with the matching domain file + framework IDs.
- **Tools** — categories/names (links in `recommendations/references.md`).
- **OPSEC** — how to stay below the line.
- **Purple-team validation** — the detections defenders should confirm.
- **Impact** — how to convert the win into business risk leadership cares about.

Cross-reference the domain files for depth and the UI (`data/techniques.json`) for
the catalog. Map every finding with `frameworks/mapping-matrix.md`.

## Priority — the hardest challenges in 2025–2026

Lead with these; they separate advanced operators from traditional pentesters:

1. **Identity compromise in MFA-protected environments** (§3, §4)
2. **Cloud privilege escalation & persistence** (§5)
3. **Evading EDR/XDR & threat-hunting teams** (§1, §8)
4. **AI/LLM application red teaming** (§11)
5. **Demonstrating business impact without disruption** (§10)
6. **Operating stealthily in mature Zero Trust** (§6)

---

## 1. Bypassing detection & response (SIEM / EDR / XDR / UEBA)

- **Challenge:** Payloads may evade AV yet get caught by **behavior** (e.g., a
  benign binary performing credential-theft-like actions) and by threat hunters.
- **Approach:** Shift from signature evasion to **behavioral** evasion. Live off
  the land, mirror normal user/host baselines, throttle pace, and prefer
  identity/SaaS paths that generate "expected" telemetry over noisy host actions.
- **Key techniques:** EDR/XDR & behavioral evasion (`HYB-EVADE-001`,
  ATT&CK T1562.001/T1027/T1497/T1070); see `domains/hybrid-infrastructure.md`.
- **Tools:** EDR-aware C2 frameworks, LOLBAS/GTFOBins tradecraft, sandbox-aware
  staging. (Documentation references only.)
- **OPSEC:** Test tradecraft against a representative EDR in a lab first; avoid
  known-bad parent/child process chains; minimize on-disk artifacts.
- **Purple-team validation:** Confirm behavioral analytics and **tamper
  protection** fire; run a hunt for the technique; deploy **honeytokens** that
  page on touch; verify log integrity/centralization.
- **Impact:** "We achieved the objective and dwell time was N days before
  detection" — a board-level metric.

## 2. Initial access (MFA, mail filtering, SWGs, awareness)

- **Challenge:** Front doors are hardened — MFA everywhere, mail filtering, secure
  web gateways, trained users.
- **Approach:** Prefer **token-centric** and **trust-centric** entry over malware:
  AiTM session theft, **illicit OAuth consent**, third-party/supply-chain paths,
  and cloud misconfigurations.
- **Key techniques:** AiTM → session token theft (`OKTA-IA-001`, T1557/T1539);
  illicit OAuth consent grant (`OKTA-IA-002`, T1528); supply-chain simulation
  (`K8S-SUPPLY-001`, `AI-SUPPLY-001`); SSRF→metadata (`AWS-IA-001`/`GCP-IA-001`).
  See `domains/identity-okta.md`, `domains/social-engineering.md`.
- **Tools:** AiTM reverse-proxy phishing, consent-grant app simulation, mail-send
  infrastructure with proper auth (SPF/DKIM/DMARC aligned).
- **OPSEC:** Aged, categorized domains; realistic sender reputation; low-volume,
  targeted sends; avoid bulk patterns that trip filtering.
- **Purple-team validation:** Phishing-resistant MFA (FIDO2/WebAuthn), user
  consent restrictions + admin-consent workflow, mail auth enforcement, report
  button telemetry.
- **Impact:** "A single consented app yielded persistent mailbox/file access with
  no password and no MFA prompt."

## 3. Identity & privilege escalation (PIM, JIT, Conditional Access, PAM)

- **Challenge:** Environments are identity-centric; admin is gated by Conditional
  Access, **PIM/JIT**, and PAM. Question: regular user → high-value admin, quietly.
- **Approach:** Hunt **Conditional Access gaps** (legacy auth, device/location
  exclusions), abuse **eligible PIM roles** and weak activation approval, and
  harvest tokens that already satisfy MFA.
- **Key techniques:** Conditional Access bypass (`OKTA-EVADE-001`, T1078/T1556);
  PIM/JIT role abuse (`OKTA-PRIV-001`, T1098.003); SAML/OIDC tampering
  (`OKTA-TOKEN-001`). See `domains/identity-okta.md`.
- **Tools:** Entra/identity recon + path tools (e.g., AzureHound, ROADtools).
- **OPSEC:** Privileged-role **activations are heavily logged** — time them with
  change windows, prefer read paths first, avoid repeated failed activations.
- **Purple-team validation:** Block legacy auth, remove broad CA exclusions,
  require approver+MFA+justification for PIM activation, alert on every privileged
  activation.
- **Impact:** "From a standard account we reached Global/Privileged Admin via an
  eligible role with no approval friction."

## 4. Active Directory & hybrid identity complexity

- **Challenge:** On-prem AD + Entra ID + SaaS + federation. Trusts, **identity
  sync**, and permission models are the real attack surface.
- **Approach:** Graph the environment, then attack the **seams** — sync servers,
  federation trust, and token-signing keys that bridge on-prem and cloud.
- **Key techniques:** AD/Entra attack-path graphing (`HYB-RECON-001`); Golden SAML
  (`HYB-PIVOT-001`, T1606.002); hybrid identity sync abuse (`HYB-CRED-003`,
  T1556.007); Kerberoasting / PtH-PtT (`HYB-CRED-002`/`HYB-LAT-001`).
  See `domains/hybrid-infrastructure.md`.
- **Tools:** BloodHound/SharpHound/AzureHound, ROADtools, Impacket.
- **OPSEC:** LDAP/graph collection is detectable — scope queries, avoid full-domain
  sweeps in one burst; treat the **sync server as Tier 0** (so do defenders).
- **Purple-team validation:** Token-signing keys in HSM + rotation; sync server &
  account hardened to Tier 0; monitor for anomalous assertion issuance and PTA
  agent changes.
- **Impact:** "A single on-prem foothold granted cloud-wide access via identity
  sync/federation" — the highest-value modern path.

## 5. Cloud security testing (AWS / Azure / GCP)

- **Challenge:** Thousands of permissions and resource relationships; privesc and
  persistence hide in IAM, trust policies, and managed identities.
- **Approach:** Enumerate effective permissions, then chain **identity privesc**
  (PassRole, impersonation, added credentials) and **cross-account/tenant trust**.
- **Key techniques:** AWS PassRole privesc (`AWS-PRIV-001`); cross-account/confused
  deputy (`AWS-PRIV-002`, T1199); GCP SA impersonation (`GCP-PRIV-001`); Entra/Azure
  managed identity & service principal abuse (`HYB-PRIV-002`, T1098.001); data
  exfil (`AWS-EXFIL-001`/`GCP-EXFIL-001`). See `domains/cloud-aws.md`,
  `domains/cloud-gcp.md`, `domains/hybrid-infrastructure.md`.
- **Tools:** Pacu, PMapper, CloudFox, ScoutSuite, Prowler, GCP-IAM-Privesc,
  AzureHound/ROADtools.
- **OPSEC:** Cloud control planes log everything (CloudTrail/Activity/Audit) —
  prefer least-noisy API paths, avoid disabling logging (that's the alert).
- **Purple-team validation:** Least-privilege IAM, `iam:PassRole` constraints,
  ExternalId/OrgID on trust policies, alerting on new SP/role credentials and
  logging-disable attempts.
- **Impact:** "A low-priv principal reached account/tenant admin and could read
  production data store X."

## 6. Lateral movement in Zero-Trust environments

- **Challenge:** Segmentation, microsegmentation, device trust, and Conditional
  Access make network pivoting hard.
- **Approach:** Move through **identity and SaaS** rather than the network — reuse
  tokens/OAuth grants, ride trusted app-to-app and cloud workload trust.
- **Key techniques:** Zero-trust lateral movement via identity & SaaS
  (`HYB-LAT-002`, T1550.001/T1199); trusted-relationship abuse.
  See `domains/hybrid-infrastructure.md`.
- **Tools:** Token/identity tooling (AzureHound, ROADtools), SaaS API clients.
- **OPSEC:** Token reuse from a new device/location is a top detection — match the
  victim's context; avoid impossible-travel patterns.
- **Purple-team validation:** Continuous Access Evaluation, token binding/device
  trust, least-privilege OAuth scopes, alert on token reuse anomalies.
- **Impact:** "We reached crown-jewel SaaS/data without ever touching the
  corporate network."

## 7. Social engineering realism

- **Challenge:** Believable pretexts that beat awareness training and simulate
  sophisticated adversaries (helpdesk, executive, physical).
- **Approach:** Deep OSINT → tailored pretext; multi-channel; for high realism,
  **AI-assisted voice/video** impersonation under strict RoE.
- **Key techniques:** OSINT/pretext (`SE-RECON-001`); credential-harvest phishing
  (`SE-IA-001`); help-desk vishing (`SE-VISH-001`); deepfake-assisted vishing /
  executive impersonation (`SE-IA-002`, T1656/T1585). See `domains/social-engineering.md`.
- **Tools:** OSINT (theHarvester, SpiderFoot), phishing sim (GoPhish), AiTM
  (Evilginx) — authorized simulation only.
- **OPSEC:** Stay strictly within RoE and law; coordinate "safe words"/abort with
  the trusted agent; never collect more PII than the objective requires.
- **Purple-team validation:** Identity-proofing for resets, callback verification,
  dual control for payments/resets, training on AI voice/video cloning.
- **Impact:** "A cloned-voice call to the helpdesk produced an MFA reset in N
  minutes."

## 8. Operational security (OPSEC)

- **Challenge:** Infrastructure attribution, malware fingerprinting, tool
  detection, and logging artifacts can burn the op before objectives are met.
- **Approach:** Compartmentalized, attributable-to-nobody infrastructure; resilient
  C2 with redirectors and encrypted, legitimate-looking traffic; minimal artifacts.
- **Key techniques:** Resilient C2 & traffic obfuscation (`HYB-C2-001`,
  T1071.001/T1090.004/T1573). See `domains/hybrid-infrastructure.md`.
- **Tools:** Redirectors/CDN fronting, profile-customized C2, payload hygiene.
- **OPSEC:** Unique infra per engagement; rotate indicators; pre-flight payloads
  against the target's defensive stack in a lab; log your own actions for dedup.
- **Purple-team validation:** Egress filtering + TLS inspection, JA3/JARM and
  domain-age analytics, block newly registered domains, beacon/jitter analytics.
- **Impact:** Clean attribution story + a precise IOC list defenders can hunt with.

## 9. Physical security integration

- **Challenge:** Badge systems, office/data-center access, secure areas — often a
  bypass around strong cyber controls; must stay legal, safe, coordinated.
- **Approach:** Recon facility & badge tech, tailgating/cloning pretexts, drop-box
  placement to bridge into the network — **only** with explicit physical RoE,
  get-out-of-jail letter, and stakeholder coordination.
- **Key techniques:** Badge/RFID cloning, tailgating, rogue device drop (covered as
  pretext + `SE-*`). Pair with on-network plays once inside.
- **OPSEC:** Carry authorization documents at all times; pre-agree points of
  contact and abort conditions; never damage property or endanger people.
- **Purple-team validation:** Anti-tailgating, visitor controls, port security/NAC
  for drop boxes, guard response procedures.
- **Impact:** "Physical access let us bypass all network controls and reach
  segment X."

## 10. Measuring real business impact (without disruption)

- **Challenge:** Executives care about business risk, not CVEs. Prove ransomware,
  data theft, disruption, or exec impersonation **could** happen — safely.
- **Approach:** Define **impact objectives** with the client up front, then
  demonstrate capability with **safe proxies** (a planted canary file exfiltrated,
  a dry-run encryption of test data, a benign "would-be" action) instead of real
  damage. Capture decisive evidence at the threshold, then stop.
- **Mapping:** Tie each objective to ATT&CK **Impact** (TA0040) and quantify dwell
  time, blast radius, and number of controls bypassed.
- **OPSEC/safety:** Pre-authorize every impact demo; use synthetic/marked data;
  never touch real production data or availability without explicit sign-off.
- **Deliver:** An executive narrative ("an attacker could deploy ransomware to N%
  of endpoints / exfiltrate dataset Y / impersonate the CFO") backed by the
  technical chain and a remediation roadmap.

## 11. AI & LLM application red teaming

- **Challenge:** Prompt injection (direct & indirect), jailbreaks, **tool/agent
  abuse**, agent hijacking, and data exfiltration through AI systems.
- **Approach:** Map the AI attack surface (model, RAG, tools, memory), then test
  guardrails, untrusted-content handling, and agent action safety. See
  `domains/ai-llm-security.md` and `domains/ai-red-team-engineer.md`.
- **Key techniques:** Direct injection/jailbreak (`AI-IA-001`); indirect injection
  (`AI-IA-002`); system-prompt leakage (`AI-CRED-001`); excessive agency
  (`AI-PRIV-001`); **agent hijacking via memory/indirect injection** (`AI-PRIV-002`);
  sensitive disclosure (`AI-EXFIL-001`); improper output handling (`AI-EXEC-001`).
  Frameworks: OWASP LLM Top 10 (2025), MITRE ATLAS, NIST AI RMF.
- **Tools:** PyRIT, Garak, Promptfoo, deepteam (automated adversarial testing).
- **OPSEC:** Respect data-handling rules on AI outputs (they can contain other
  users' data); rate-limit automated probes to avoid cost/DoS side effects.
- **Purple-team validation:** Instruction/data separation, input+output guardrails,
  per-user authz on retrieval/tools, human-in-the-loop for state-changing actions.
- **Impact:** "Indirect injection in a shared doc made the agent exfiltrate another
  user's data / take an unauthorized action."

## 12. Purple-team collaboration (measurable improvement)

- **Challenge:** Mature orgs want red teams to **improve defenses**, not just win.
- **Approach:** Run detections-in-the-loop: execute a technique, confirm whether it
  alerts, tune with defenders, re-test. Map everything to MITRE ATT&CK/ATLAS.
- **Deliverables:** Per-technique **detection coverage matrix** (detected / partial
  / missed), tuned detection rules, improved response playbooks, and a prioritized
  gap list. Use `frameworks/mapping-matrix.md` and the Finding template in
  `recommendations/remediation-playbook.md`.
- **Impact:** Shift the scorecard from "we got domain admin" to "we raised
  detection coverage from X% to Y% across these tactics."

---

## Running the engagement (tie it together)

1. **Govern & scope** — RoE, objectives, impact definitions, safety/abort criteria,
   data-handling rules (`SKILL.md` operating model).
2. **Recon & map** — attack surface across identity, cloud, network, AI, people.
3. **Initial access** — prefer token/trust/OAuth paths (§2).
4. **Identity & privilege** — Conditional Access/PIM/cloud privesc (§3–§5).
5. **Lateral movement** — identity/SaaS in Zero Trust (§6).
6. **Objective & impact** — demonstrate with safe proxies (§10).
7. **OPSEC throughout** — resilient infra, minimal artifacts (§8).
8. **Purple-team & report** — detection matrix, framework mapping, exec narrative,
   remediation roadmap (§12, `recommendations/remediation-playbook.md`).

**Every finding ships with:** kill-chain phase, framework IDs, business impact,
a recommendation, and a credible reference — defanged, with no secrets or
org-specific data.
