# Framework Cross-Mapping Matrix

Crosswalk of kill-chain phases ↔ domains ↔ frameworks. Use it to ensure each
finding carries consistent tags. The machine-readable version is
`data/mappings.json` (and powers the UI).

## Phase → framework anchor

| Phase | ATT&CK tactic | ATLAS tactic | Typical OWASP |
|-------|---------------|--------------|---------------|
| Reconnaissance | TA0043 | AML.TA0002 | — |
| Resource Development | TA0042 | AML.TA0003 | — |
| Initial Access | TA0001 | AML.TA0004 | A01/A03/A10, LLM01 |
| Model/AI Access | — | AML.TA0000 | LLM01/LLM07 |
| Execution | TA0002 | AML.TA0005 | A03, LLM05 |
| Persistence | TA0003 | AML.TA0006 | A05 |
| Privilege Escalation | TA0004 | AML.TA0012 | A01, LLM06 |
| Defense Evasion | TA0005 | AML.TA0007 | A09, LLM01 |
| Credential Access | TA0006 | AML.TA0013 | A07, LLM02 |
| Discovery | TA0007 | AML.TA0008 | — |
| Lateral Movement | TA0008 | — | A01 |
| Collection | TA0009 | AML.TA0009 | A02, LLM02 |
| Command & Control | TA0011 | — | — |
| Exfiltration | TA0010 | AML.TA0010 | A02, LLM02/LLM10 |
| Impact | TA0040 | AML.TA0011 | LLM09/LLM10 |

## Domain → primary frameworks

| Domain | ATT&CK | ATLAS | OWASP |
|--------|--------|-------|-------|
| application-security | ✅ | — | Web/API/MASVS Top 10 |
| cloud-aws | ✅ | — | A01/A02/A05/A10 |
| cloud-gcp | ✅ | — | A01/A02/A05/A10 |
| hybrid-infrastructure | ✅ | — | A07 |
| kubernetes | ✅ | — | A05/A06 |
| identity-okta | ✅ | — | A02/A07 |
| social-engineering | ✅ | (chatbot) AML | (chatbot) LLM01/LLM06 |
| ai-llm-security | (infra) ✅ | ✅ | LLM Top 10 2025 |

## Rule of thumb
- **Traditional** finding → ATT&CK technique (+ OWASP web/API/cloud item).
- **AI/LLM** finding → OWASP LLM Top 10 item **and** ATLAS technique.
- **Engagement-level** structure/reporting → NIST AI RMF functions.
