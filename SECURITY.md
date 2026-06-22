# Security & Ethical-Use Policy

## Nature of this project

This repository is **documentation and planning material** for authorized
offensive security work. It contains **no exploit code** and **does not scan,
attack, or interact with any system**. It is a knowledge base plus a static
reference UI.

## Acceptable use

Use this material **only** for:
- Authorized penetration tests and red team engagements with **explicit written
  permission** and a defined scope / rules of engagement.
- AI assurance and security research on systems you own or are authorized to test.
- Defensive teams learning attacker techniques to build better detections and fixes.

**Do not** use this material to access, test, or disrupt systems you do not own
or lack written authorization to assess. Doing so may be illegal. The authors
and contributors accept **no liability** for misuse.

## What must never be committed

To keep this repository safe to publish:
- **No secrets** — credentials, API keys, tokens, private keys, `.env` files.
- **No organization-specific or customer data** of any kind.
- **No personal data** (names, emails, internal hostnames, identifiers).
- **No live engagement artifacts** — scope files, loot, captures, scan output.
- **No working exploits** — keep techniques conceptual and defanged.

`.gitignore` blocks common secret/artifact patterns as defense-in-depth, but the
ultimate responsibility is on the contributor. Review every change before commit.

## Reporting a problem

If you find sensitive data, a credential, or content that should not be public in
this repository, please open an issue **without including the sensitive value**
(describe the file and line), or contact the repository owner privately so it can
be removed and history scrubbed promptly.

## Handling sensitive findings (operational)

When using this skill during a real engagement, keep findings and evidence in a
**separate, private** location — never in this repository. Defang evidence,
redact secrets, and follow your engagement's data-handling rules. The UI stores
drafts only in the browser's `localStorage` and uploads nothing.
