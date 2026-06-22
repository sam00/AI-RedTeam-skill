# Framework: MITRE ATT&CK (Enterprise)

Knowledge base of adversary tactics & techniques. Use technique IDs (`Txxxx`)
in every finding. Source: https://attack.mitre.org/

## Tactics (the "why" — kill-chain phases)

| ID | Tactic | Red-team meaning |
|----|--------|------------------|
| TA0043 | Reconnaissance | Gather info on targets |
| TA0042 | Resource Development | Build/acquire infra & capabilities |
| TA0001 | Initial Access | Get a foothold |
| TA0002 | Execution | Run attacker code |
| TA0003 | Persistence | Maintain access |
| TA0004 | Privilege Escalation | Gain higher permissions |
| TA0005 | Defense Evasion | Avoid detection |
| TA0006 | Credential Access | Steal credentials |
| TA0007 | Discovery | Learn the environment |
| TA0008 | Lateral Movement | Move across systems |
| TA0009 | Collection | Gather target data |
| TA0011 | Command and Control | Communicate with implants |
| TA0010 | Exfiltration | Steal data out |
| TA0040 | Impact | Disrupt/destroy/manipulate |

## Frequently used techniques in this skill

| ID | Technique | Domains |
|----|-----------|---------|
| T1595 / T1592 | Active/Information recon | appsec, hybrid |
| T1190 | Exploit public-facing app | appsec, cloud, k8s |
| T1078 / T1078.004 | Valid accounts / cloud accounts | cloud, hybrid, okta |
| T1566 / .001/.002 | Phishing | social-eng, okta |
| T1557 | Adversary-in-the-Middle | okta, social-eng |
| T1539 | Steal web session cookie | okta |
| T1621 | MFA request generation (fatigue) | okta |
| T1110 / .003 | Brute force / password spraying | hybrid, okta |
| T1558 / .003/.004 | Kerberos (Kerberoast/AS-REP) | hybrid |
| T1003 / .006 | OS credential dumping / DCSync | hybrid |
| T1550 / .002/.003 | PtH / PtT / token use | hybrid, okta |
| T1606.002 | Forge SAML tokens (Golden SAML) | okta, hybrid |
| T1552 / .005 | Unsecured creds / cloud metadata | cloud, k8s |
| T1530 / T1537 | Data from/transfer to cloud | cloud |
| T1610 / T1611 | Deploy container / escape to host | k8s |
| T1098 | Account manipulation | cloud, hybrid, okta |
| T1562.008 | Impair defenses: disable cloud logs | cloud |

## How to use
- Map each offensive step to its **tactic** (phase) and **technique** (method).
- Combine with ATLAS for AI-specific steps (`frameworks/mitre-atlas.md`).
- Crosswalk in `frameworks/mapping-matrix.md`.
