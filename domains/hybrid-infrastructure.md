# Domain: Hybrid Infrastructure (On-prem ↔ Cloud, Active Directory, BloodHound)

> Authorized testing only. Hybrid environments connect on-prem Active Directory
> to cloud (Entra ID/AWS/GCP). Attack paths often cross the boundary.

## Tooling quick reference

| Tool | Purpose | Install |
|------|---------|---------|
| BloodHound (CE/Legacy) | AD/Entra/Azure attack-path graphing | https://github.com/SpecterOps/BloodHound |
| SharpHound / AzureHound | BloodHound collectors | https://github.com/SpecterOps/SharpHound |
| nmap / masscan | Network discovery | kali default |
| CrackMapExec / NetExec | SMB/AD spraying & enumeration | https://github.com/Pennyw0rth/NetExec |
| Impacket | AD protocol tooling (secretsdump, etc.) | https://github.com/fortra/impacket |
| Responder | LLMNR/NBT-NS/MDNS poisoning | https://github.com/lgandx/Responder |
| Rubeus / Certify | Kerberos & AD CS abuse | github (GhostPack) |
| ROADtools | Entra ID enumeration | https://github.com/dirkjanm/ROADtools |
| Kerbrute | Kerberos user/pass spraying | github |

## Phase: Reconnaissance / Discovery

| Technique | ATT&CK | Tools |
|-----------|--------|-------|
| Network host/service discovery | T1046, T1018 | nmap, masscan |
| AD enumeration (users/groups/ACLs) | T1087, T1069 | SharpHound, NetExec, ldapdomaindump |
| Attack-path graphing | T1482 | BloodHound + SharpHound |
| Entra ID / Azure enumeration | T1087 | AzureHound, ROADtools |
| SMB share & null-session enum | T1135 | NetExec, smbclient |

**Steps (BloodHound workflow):**
1. Collect: run SharpHound (on-prem) and/or AzureHound (cloud) authorized.
   `SharpHound.exe -c All` → produces JSON/zip.
2. Ingest the zip into BloodHound.
3. Query pre-built paths: "Shortest paths to Domain Admins", "Kerberoastable
   users", "Owned principals → high value".
- **Recommendation:** tier admin model, prune excessive ACLs, monitor LDAP
  recon, restrict SeEnableDelegation. Ref: SpecterOps BloodHound docs.

## Phase: Credential Access

| Technique | ATT&CK | Tools | Recommendation |
|-----------|--------|-------|----------------|
| LLMNR/NBT-NS poisoning → hash capture | T1557.001 | Responder | Disable LLMNR/NBT-NS, SMB signing |
| Kerberoasting | T1558.003 | Rubeus, GetUserSPNs | Strong/managed service-account passwords, gMSA |
| AS-REP roasting | T1558.004 | Rubeus, GetNPUsers | Require preauth |
| Password spraying | T1110.003 | NetExec, Kerbrute | Lockout policy, MFA, banned-password lists |
| DCSync | T1003.006 | secretsdump, mimikatz | Restrict replication rights |
| AD CS abuse (ESC1-ESC8) | T1649 | Certify, Certipy | Fix template ACLs/EKUs, enable strong mapping |

## Phase: Lateral Movement / Privilege Escalation

| Technique | ATT&CK | Tools |
|-----------|--------|-------|
| Pass-the-Hash / Pass-the-Ticket | T1550.002/.003 | Impacket, Rubeus |
| Overpass-the-Hash | T1550 | Rubeus |
| Unconstrained/constrained delegation abuse | T1558 | Rubeus |
| ACL-based escalation (GenericAll, etc.) | T1098 | BloodHound, PowerView |
| SMB/WinRM/RDP movement | T1021 | NetExec, evil-winrm |

- **Recommendation:** LAPS for local admin, credential guard, tiered admin,
  disable unconstrained delegation, segment networks. Ref: MITRE ATT&CK; MS docs.

## Phase: On-prem ↔ Cloud pivot

| Technique | ATT&CK | Recommendation |
|-----------|--------|----------------|
| AD-synced creds → Entra ID (PHS/PTA abuse) | T1078.004 | Protect AD Connect server (Tier 0) |
| Seamless SSO / Kerberos to cloud | T1550 | Monitor AZUREADSSOACC, rotate |
| Federation trust abuse (Golden SAML) | T1606.002 | Protect ADFS token-signing keys |
| Hybrid join device abuse | T1078 | Conditional Access, device compliance |
| On-prem SSRF/host → cloud IMDS | T1552.005 | IMDSv2/metadata controls (see cloud domains) |

**Steps (Golden SAML concept):**
- If the ADFS/IdP token-signing key is compromised, an attacker can forge SAML
  assertions to authenticate to federated cloud apps as any user.
- **Recommendation:** treat token-signing keys as Tier 0, HSM-back them, rotate,
  monitor issuance anomalies. Ref: MITRE T1606.002; CISA guidance.

## Cross-references
- Identity provider specifics: `domains/identity-okta.md`
- Cloud privesc/exfil: `domains/cloud-aws.md`, `domains/cloud-gcp.md`
- Frameworks/fixes/citations: `frameworks/`, `recommendations/`
