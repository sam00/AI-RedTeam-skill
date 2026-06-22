# Domain: Cloud — AWS

> Authorized testing only, within the scope of the AWS account(s) explicitly in
> your rules of engagement. AWS requires no prior approval for most pentesting
> of your own resources, but **simulated DoS, and testing of other tenants is
> prohibited** — confirm AWS policy and your authorization first.

## Tooling quick reference

| Tool | Purpose | Install |
|------|---------|---------|
| AWS CLI | Baseline access & enumeration | https://aws.amazon.com/cli/ |
| Pacu | AWS exploitation framework | https://github.com/RhinoSecurityLabs/pacu |
| ScoutSuite | Multi-cloud config audit | https://github.com/nccgroup/ScoutSuite |
| Prowler | AWS/Azure/GCP security scanning | https://github.com/prowler-cloud/prowler |
| enumerate-iam | IAM permission brute enumeration | https://github.com/andresriancho/enumerate-iam |
| CloudFox | Attack-surface & privesc discovery | https://github.com/BishopFox/cloudfox |
| s3scanner / s3enum | S3 bucket discovery | github |
| PMapper | IAM privilege-escalation graphing | https://github.com/nccgroup/PMapper |
| trufflehog / gitleaks | Secret discovery in code/repos | github |

## Phase: Reconnaissance / Discovery

| Technique | ATT&CK | Tools |
|-----------|--------|-------|
| Account/identity enumeration | T1580, T1087 | `aws sts get-caller-identity`, CloudFox |
| IAM permission enumeration | T1069 | enumerate-iam, Pacu `iam__enum_permissions` |
| Public S3 bucket discovery | T1530, T1619 | s3scanner, ScoutSuite |
| Service & resource inventory | T1580 | CloudFox, ScoutSuite, Prowler |
| Secrets in code / SSM / env | T1552 | trufflehog, `aws ssm get-parameters` |

**Steps (initial enumeration):**
1. Identify principal: `aws sts get-caller-identity`
2. Enumerate effective permissions: `python enumerate-iam.py --access-key ... --secret-key ...`
3. Map attack surface: `cloudfox aws --profile PROFILE all-checks`
- **Recommendation:** least-privilege IAM, deny `iam:*` broadly, CloudTrail +
  GuardDuty on, S3 Block Public Access account-wide. Ref: AWS IAM best practices.

## Phase: Initial Access

| Technique | ATT&CK | Tools |
|-----------|--------|-------|
| Leaked/long-lived access keys | T1078.004 | trufflehog, gitleaks |
| SSRF → IMDS credential theft | T1190 → T1552.005 | Burp + app SSRF |
| Public service exploitation | T1190 | nuclei, manual |
| Phished console/SSO creds | T1566 | see `domains/social-engineering.md` |

**Steps (IMDS credential exposure via SSRF, defanged):**
- Reachability test only: `http://169.254.169.254/latest/meta-data/iam/security-credentials/`
- **Recommendation:** enforce **IMDSv2** (`HttpTokens=required`), hop limit 1,
  SSRF egress controls. Ref: AWS IMDSv2; HackTricks AWS.

## Phase: Privilege Escalation

| Technique | ATT&CK | Tools | Recommendation |
|-----------|--------|-------|----------------|
| `iam:PassRole` + service launch | T1078.004 | Pacu, PMapper | Constrain PassRole to specific roles/services |
| `iam:CreatePolicyVersion` / attach | T1098 | Pacu | Restrict IAM write perms |
| `iam:CreateAccessKey` for other user | T1098.001 | Pacu | Restrict iam:CreateAccessKey |
| Lambda role abuse | T1078.004 | Pacu | Scope Lambda exec roles |
| `sts:AssumeRole` chaining | T1548 | aws cli, PMapper | Tighten trust policies, ext-id |
| EC2 `UserData` / SSM RunCommand | T1059 | Pacu, SSM | Restrict ssm:SendCommand, audit UserData |

**Steps (PassRole privesc concept):**
1. Identify a passable high-priv role: `aws iam list-roles` + PMapper graph.
2. Launch a service that assumes it (e.g., create Lambda/EC2 with that role).
3. Use the resulting role credentials for further access.
- **Recommendation:** scope `iam:PassRole` with `iam:PassedToService` conditions
  and explicit role ARNs. Ref: Rhino Security PassRole research; PMapper.

## Phase: Persistence / Defense Evasion

| Technique | ATT&CK | Recommendation |
|-----------|--------|----------------|
| New IAM users/keys, backdoor roles | T1098 | Alert on IAM changes, rotate keys |
| Lambda backdoor / event triggers | T1546 | Review functions & triggers |
| Disable CloudTrail / GuardDuty | T1562.008 | Org SCP to protect logging, multi-region trail |
| Console login profile creation | T1098 | Detect CreateLoginProfile |

## Phase: Lateral Movement / Collection / Exfiltration

| Technique | ATT&CK | Tools |
|-----------|--------|-------|
| Cross-account role assumption | T1548 | aws cli, CloudFox |
| EKS access via IAM/`aws-auth` | T1078 | see `domains/kubernetes.md` |
| S3 data collection/exfil | T1530, T1537 | aws s3 sync, CloudFox |
| RDS snapshot share/exfil | T1537 | aws cli |
| Secrets Manager / SSM dump | T1552 | Pacu |

- **Recommendation:** SCPs to block cross-account/cross-region exfil, S3 access
  logging + Block Public Access, KMS-scoped policies, VPC endpoints + egress
  controls. Ref: AWS Security Reference Architecture; ScoutSuite/Prowler checks.

## Cross-references
- Hybrid AD↔AWS: `domains/hybrid-infrastructure.md`
- Frameworks: `frameworks/mitre-attack.md`, `frameworks/mapping-matrix.md`
- Fixes & citations: `recommendations/remediation-playbook.md`, `recommendations/references.md`
