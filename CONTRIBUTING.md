# Contributing

Thanks for helping improve the AI Red Team Skill. This is a **documentation +
UI** project: contributions are reference content, framework mappings, tool
entries, remediation guidance, and UI improvements — never live exploit code or
operational attack payloads against real targets.

## Ground rules

1. **Authorized, ethical use only.** All content is framed for authorized red
   team / pentest work. Do not add material whose only purpose is to attack
   systems without consent.
2. **No secrets, ever.** No real credentials, tokens, API keys, customer data,
   internal hostnames, or organization-specific identifiers. CI and reviewers
   will reject PRs containing them.
3. **Cite credible sources.** Every technique/recommendation should reference an
   authoritative source (MITRE, OWASP, NIST, vendor docs, HackTricks, or a named
   tool's documentation). Add the link to `recommendations/references.md`.
4. **Keep it lightweight.** Favor concise, scannable content. The `SKILL.md`
   router must stay short; put detail in domain files (progressive disclosure).
5. **Keep data and docs in sync.** If you add a technique to a `domains/*.md`
   file, add the structured entry to `data/techniques.json` (and tools to
   `data/tools.json`) so the UI stays accurate.

## Data schema

### `data/techniques.json` entry
```json
{
  "id": "AWS-PRIV-001",
  "name": "IAM privilege escalation via PassRole",
  "domain": "cloud-aws",
  "phase": "privilege-escalation",
  "description": "One-line offensive summary.",
  "frameworks": { "attack": ["T1078.004"], "atlas": [], "owasp": [], "owaspLlm": [], "nist": [] },
  "tools": ["pacu", "enumerate-iam"],
  "recommendation": "One-line fix.",
  "references": ["hacktricks-gcp", "mitre-attack"]
}
```

### `data/tools.json` entry
```json
{
  "id": "bloodhound",
  "name": "BloodHound",
  "domains": ["hybrid-infrastructure", "identity-okta"],
  "purpose": "AD/Azure attack-path graphing.",
  "install": "https://github.com/SpecterOps/BloodHound",
  "reference": "bloodhound"
}
```

## Workflow

1. Fork, branch (`feat/<topic>` or `fix/<topic>`).
2. Make edits; keep markdown linted and JSON valid (`python3 -m json.tool < data/techniques.json`).
3. Open a PR describing the change and citing sources.

## Validating JSON locally
```bash
for f in data/*.json; do python3 -m json.tool "$f" > /dev/null && echo "OK $f"; done
```
