# How to Write Red Team Skills

This guide covers two things an AI Red Team engineer authors:

- **A. The agent Skill** — the `SKILL.md`-based package an AI assistant loads.
- **B. A technique playbook** — a single offensive entry (data + docs + finding).

Goal: keep everything **lightweight, accurate, sourced, and safe** (offensive
documentation only — no live attacks, no secrets).

---

## A. Authoring an agent Skill (the SKILL.md format)

An agent Skill is a folder with a `SKILL.md` entry file plus bundled resources.
The assistant reads `SKILL.md` first and pulls in other files **only as needed**.

### 1. Frontmatter (required)
```yaml
---
name: ai-redteam            # kebab-case, unique
description: >-             # WHAT it does + WHEN to use it (this drives invocation)
  One or two sentences describing the skill and the trigger conditions.
license: Apache-2.0
---
```
- `description` is the most important line: write it so the agent knows *exactly
  when* to load the skill. Mention the domains and the trigger ("use when…").

### 2. Progressive disclosure (low token consumption)
The single most important design rule:

- Keep `SKILL.md` **short** — it is a **router**, not an encyclopedia.
- Put detail in separate files (`domains/*.md`, `frameworks/*.md`).
- Provide a **routing table** so the agent loads only the one file it needs.
- Put bulk/structured data in `data/*.json` (loaded by code/UI, not the prompt).

```
skill/
├── SKILL.md          # short router + safety + operating model
├── domains/*.md      # load-on-demand detail
├── frameworks/*.md   # framework references
├── data/*.json       # structured source of truth (feeds UI/tools)
└── recommendations/  # templates + references
```

### 3. Anatomy of THIS skill (use as a template)
- `SKILL.md` — safety, operating model, routing table.
- `domains/` — one file per attack surface; each: tools → phases → techniques →
  defanged steps → recommendation → references.
- `frameworks/` — ATT&CK, ATLAS, OWASP, OWASP LLM, NIST AI RMF + crosswalk.
- `data/` — `techniques.json`, `tools.json`, `mappings.json` (single source of
  truth, also powers the UI).
- `recommendations/` — finding template + credible references.

### 4. Skill quality bar
- Authorized-use framing and a **safety section** up top.
- Deterministic routing; no duplicated content across files.
- Every claim traceable to a credible source.
- Validates: `for f in data/*.json; do python3 -m json.tool "$f" >/dev/null; done`.

---

## B. Authoring a technique playbook (extend this skill)

A technique lives in **three places** kept in sync: the structured `data`, the
human `domain` doc, and (when used) a `finding`.

### Step 1 — Add the structured entry to `data/techniques.json`
```json
{
  "id": "AI-IA-003",
  "name": "Multi-turn crescendo jailbreak",
  "domain": "ai-llm",
  "phase": "initial-access",
  "description": "Gradually escalate a conversation to bypass guardrails.",
  "frameworks": { "attack": [], "atlas": ["AML.T0054"], "owasp": [], "owaspLlm": ["LLM01"], "nist": ["Measure"] },
  "tools": ["pyrit", "promptfoo"],
  "recommendation": "Multi-turn-aware guardrails, conversation-level policy, refuse-and-log.",
  "references": ["owasp-llm", "atlas", "ms-airt"]
}
```
Field rules:
- `id` — `DOMAIN-PHASE-NN` (e.g., `AWS-PRIV-002`).
- `domain` — must match a `data/mappings.json` domain id.
- `phase` — must match a `data/mappings.json` phase id.
- `frameworks` — arrays of real IDs (verify against the live matrices).
- `tools` — ids that exist in `data/tools.json` (add the tool if missing).
- `references` — keys that exist in `data/mappings.json.references` **and**
  `recommendations/references.md`.

### Step 2 — Add a tool (if new) to `data/tools.json`
```json
{ "id": "pyrit", "name": "Microsoft PyRIT", "domains": ["ai-llm"], "purpose": "AI red-team orchestration.", "install": "https://github.com/Azure/PyRIT", "reference": "pyrit" }
```
Add its `reference` key/URL to `data/mappings.json.references` and
`recommendations/references.md`.

### Step 3 — Document it in the matching `domains/<domain>.md`
Add a row to the relevant phase table and, for important techniques, a short
**defanged** step-by-step:
```markdown
**Steps (concept only — authorized targets):**
1. ... high-level step ...
2. ... high-level step ...
- **Recommendation:** ... Ref: <source>.
```

### Step 4 — Produce a finding (when reporting)
Use the template in `recommendations/remediation-playbook.md`. Or, in the UI
(`ui/`), open the technique → **Add to findings** → **Export Markdown**.

---

## Writing rules (apply to every entry)
1. **Authorized use only** — frame for pentest/red team with consent.
2. **Defang** — no working exploit payloads against real targets; concept-level
   steps and command *templates* with placeholders (`TARGET`, `URL`).
3. **No secrets** — never real credentials, tokens, customer data, or
   org-specific identifiers.
4. **Cite sources** — at least one credible reference per technique
   (MITRE/OWASP/NIST/vendor/tool docs).
5. **Map to frameworks** — traditional → ATT&CK (+OWASP); AI → OWASP LLM +
   ATLAS; engagement → NIST AI RMF.
6. **Always include a recommendation** — every finding ships with a fix.

## Validate before committing
```bash
# JSON validity
for f in data/*.json; do python3 -m json.tool "$f" >/dev/null && echo "OK $f"; done
# UI/JS syntax (if you touched ui/app.js)
node --check ui/app.js
```

## Publish checklist
- [ ] No secrets / no org-specific data anywhere.
- [ ] `data/*.json` valid; ids/refs cross-resolve.
- [ ] New techniques/tools reflected in both `data/` and `domains/`.
- [ ] References added to `recommendations/references.md` + `mappings.json`.
- [ ] `SKILL.md` router still short and accurate.
- [ ] `README.md` updated if structure changed.

## Cross-references
- Methodology: `domains/ai-red-team-engineer.md`
- Contribution workflow & schema: `../CONTRIBUTING.md`
- Finding template: `recommendations/remediation-playbook.md`
