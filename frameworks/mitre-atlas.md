# Framework: MITRE ATLAS (Adversarial Threat Landscape for AI Systems)

ATT&CK-style knowledge base for attacks on AI-enabled systems. Use `AML.Txxxx`
technique IDs in AI findings. Source: https://atlas.mitre.org/

## Tactics (AI-specific kill chain)

| ID | Tactic |
|----|--------|
| AML.TA0002 | Reconnaissance |
| AML.TA0003 | Resource Development |
| AML.TA0004 | Initial Access |
| AML.TA0000 | AI Model Access |
| AML.TA0005 | Execution |
| AML.TA0006 | Persistence |
| AML.TA0012 | Privilege Escalation |
| AML.TA0007 | Defense Evasion |
| AML.TA0013 | Credential Access |
| AML.TA0008 | Discovery |
| AML.TA0009 | Collection |
| AML.TA0001 | AI Attack Staging |
| AML.TA0010 | Exfiltration |
| AML.TA0011 | Impact |

## Frequently used techniques in this skill

| ID | Technique | OWASP LLM 2025 |
|----|-----------|----------------|
| AML.T0051 | LLM Prompt Injection (.000 direct, .001 indirect) | LLM01 |
| AML.T0054 | LLM Jailbreak | LLM01 |
| AML.T0056 | LLM Meta Prompt / system-prompt extraction | LLM07 |
| AML.T0057 | LLM Data Leakage | LLM02 |
| AML.T0053 | LLM Plugin Compromise / unsafe tool use | LLM06 |
| AML.T0050 | LLM-based downstream attack (output handling) | LLM05 |
| AML.T0020 | Poison Training Data | LLM04 |
| AML.T0018 | Backdoor ML Model | LLM04 |
| AML.T0024 | Exfiltration via ML Inference API | LLM02 |
| AML.T0048 | External harms / model extraction | LLM10 |
| AML.T0043 | Craft Adversarial Data | LLM01 |
| AML.T0015 | Evade ML Model | LLM01 |
| AML.T0029 | Denial of ML Service | LLM10 |
| AML.T0010 | AI Supply Chain Compromise | LLM03 |

> Note: ATLAS evolves; confirm exact sub-technique IDs/names against the live
> matrix at atlas.mitre.org when finalizing a report.

## How to use
- For any AI/agent finding, record the ATLAS technique **and** the OWASP LLM
  item. See `domains/ai-llm-security.md` and `frameworks/owasp-llm-top10.md`.
