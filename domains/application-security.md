# Domain: Application Security (Web / API / Mobile)

> Authorized testing only. Confirm scope, target list, and rules of engagement
> before any action. Command templates use placeholders like `TARGET`, `URL`,
> `WORDLIST` — never run against systems you are not authorized to test.

## Tooling quick reference

| Tool | Purpose | Install |
|------|---------|---------|
| Burp Suite | Intercept proxy, scanner, repeater | https://portswigger.net/burp |
| OWASP ZAP | Open-source intercept proxy/scanner | https://www.zaproxy.org/ |
| ffuf / feroxbuster | Content & parameter fuzzing | `apt install ffuf` / kali |
| nuclei | Templated vuln scanning | https://github.com/projectdiscovery/nuclei |
| sqlmap | SQL injection automation | https://sqlmap.org/ |
| nikto | Web server checks | kali default |
| amass / subfinder | Subdomain enumeration | projectdiscovery |
| httpx / katana | Probing & crawling | projectdiscovery |
| jwt_tool | JWT analysis/attacks | https://github.com/ticarpi/jwt_tool |
| mitmproxy | Mobile/API interception | https://mitmproxy.org/ |
| MobSF | Mobile app static/dynamic analysis | https://mobsf.github.io/ |

## Phase: Reconnaissance

| Technique | ATT&CK | OWASP | Tools |
|-----------|--------|-------|-------|
| Subdomain & asset enumeration | T1595, T1592 | — | amass, subfinder, httpx |
| Content discovery / hidden endpoints | T1595.003 | — | ffuf, feroxbuster, katana |
| Tech fingerprinting | T1592.002 | — | httpx, whatweb, wappalyzer |
| Parameter discovery | T1595 | — | arjun, ffuf, paramspider |

**Steps (content discovery):**
1. Crawl: `katana -u URL -d 3 -o crawl.txt`
2. Brute paths: `ffuf -u URL/FUZZ -w WORDLIST -mc 200,204,301,302,401,403`
3. Probe live hosts: `httpx -l hosts.txt -title -tech-detect -status-code`
- **Recommendation:** remove unused endpoints, enforce auth on all routes, hide
  verbose tech banners. Ref: OWASP ASVS V1/V14.

## Phase: Initial Access / Exploitation (OWASP Top 10)

| Technique | ATT&CK | OWASP | Tools | Recommendation |
|-----------|--------|-------|-------|----------------|
| Broken access control / IDOR | T1190 | A01 | Burp, Autorize | Server-side authz checks per object; deny by default |
| Injection (SQLi/NoSQLi/cmd) | T1190 | A03 | sqlmap, Burp | Parameterized queries, allow-lists, least-priv DB user |
| SSRF | T1190 | A10 | Burp Collaborator | Egress allow-list, block link-local 169.254.169.254, IMDSv2 |
| XSS (reflected/stored/DOM) | T1059.007 | A03 | Burp, DalFox | Output encoding, CSP, trusted types |
| Insecure deserialization | T1190 | A08 | ysoserial | Avoid native deserialization; sign/validate payloads |
| XXE | T1190 | A05 | Burp | Disable external entities in XML parser |
| Auth / session flaws | T1110, T1212 | A07 | Burp, hydra | MFA, secure cookies, rotate session on auth |
| JWT abuse (alg=none, weak key) | T1212 | A02/A07 | jwt_tool | Verify alg, strong keys, validate aud/exp |
| File upload → RCE | T1190 | A04 | Burp | Validate type/size, store off web root, no exec |
| Business logic abuse | T1190 | A04 | manual | Threat-model flows; server-side invariants |

**Steps (SSRF → cloud metadata, AWS example, defanged):**
1. Find a parameter that fetches a URL (e.g., `?img=URL`).
2. Point it at the metadata endpoint to test reachability (do **not** exfiltrate
   real creds): `http://169.254.169.254/latest/meta-data/`.
3. If reachable, this proves SSRF + metadata exposure.
- **Recommendation:** enforce IMDSv2 (session tokens), egress filtering, and
  block requests to link-local/internal ranges. Ref: OWASP A10, AWS IMDSv2 docs.

## Phase: API-specific (OWASP API Top 10)

| Technique | OWASP API | Tools |
|-----------|-----------|-------|
| BOLA (object-level authz) | API1 | Burp, Autorize |
| Broken authentication | API2 | jwt_tool, Burp |
| Broken object property authz / mass assignment | API3 | Burp |
| Unrestricted resource consumption | API4 | ffuf (rate) |
| Broken function-level authz | API5 | Burp |
| Excessive data exposure | API3 | manual review |
| SSRF via API | API7 | Burp Collaborator |

- **Recommendation:** centralize authz, schema-validate every request, rate-limit
  and quota, never trust client-supplied IDs/roles. Ref: OWASP API Security Top 10.

## Phase: Mobile (OWASP MASVS / MASTG)

| Technique | OWASP MASVS | Tools |
|-----------|-------------|-------|
| Static analysis (hardcoded secrets, exported components) | MASVS-STORAGE/PLATFORM | MobSF, jadx, apktool |
| Traffic interception / cert pinning bypass | MASVS-NETWORK | mitmproxy, Frida, objection |
| Insecure local storage | MASVS-STORAGE | MobSF, adb |

- **Recommendation:** no secrets in client, TLS + pinning done right, encrypt
  local data, validate on server. Ref: OWASP MASTG.

## Cross-references
- Frameworks: `frameworks/owasp-top10.md`, `frameworks/mitre-attack.md`
- Findings/fixes: `recommendations/remediation-playbook.md`
- Citations: `recommendations/references.md`
