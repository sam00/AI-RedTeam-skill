# Domain: Cloud — GCP

> Authorized testing only, scoped to the GCP project(s)/org in your rules of
> engagement. Some GCP tests may require notifying Google; confirm policy and
> your written authorization first.

## Tooling quick reference

| Tool | Purpose | Install |
|------|---------|---------|
| gcloud CLI | Baseline access & enumeration | https://cloud.google.com/sdk |
| ScoutSuite | Multi-cloud config audit | https://github.com/nccgroup/ScoutSuite |
| Prowler | GCP security scanning | https://github.com/prowler-cloud/prowler |
| GCP IAM Privesc Scanner | Detect privesc paths | https://github.com/RhinoSecurityLabs/GCP-IAM-Privilege-Escalation |
| gcploit / hayat | GCP enumeration/exploitation | github |
| CloudFox | Attack-surface discovery (GCP support) | https://github.com/BishopFox/cloudfox |
| trufflehog / gitleaks | Secret discovery | github |

## Phase: Reconnaissance / Discovery

| Technique | ATT&CK | Tools |
|-----------|--------|-------|
| Identify principal & projects | T1580, T1087 | `gcloud auth list`, `gcloud projects list` |
| Enumerate IAM bindings | T1069 | `gcloud projects get-iam-policy PROJECT` |
| Service account inventory | T1087 | `gcloud iam service-accounts list` |
| Test permissions | T1069 | `gcloud iam ... testIamPermissions`, privesc scanner |
| Public GCS bucket discovery | T1530 | ScoutSuite, `gsutil ls` |

**Steps (initial enumeration):**
1. Who am I: `gcloud auth list` / `gcloud config list`
2. Project IAM: `gcloud projects get-iam-policy PROJECT --format=json`
3. Privesc paths: run RhinoSecurityLabs GCP-IAM-Privilege-Escalation enumerator.
- **Recommendation:** least-privilege IAM, avoid primitive roles
  (Owner/Editor), enable Cloud Audit Logs (Admin + Data Access), Org Policy
  constraints. Ref: GCP IAM best practices; HackTricks GCP.

## Phase: Initial Access

| Technique | ATT&CK | Tools |
|-----------|--------|-------|
| Leaked SA key (JSON) | T1078.004 | trufflehog, `gcloud auth activate-service-account` |
| SSRF → GCE metadata token theft | T1190 → T1552.005 | app SSRF + Burp |
| OAuth/refresh token theft | T1528 | manual |
| Public Cloud Function/Run exploit | T1190 | nuclei, manual |

**Steps (GCE metadata token exposure via SSRF, defanged):**
- Reachability test only (requires `Metadata-Flavor: Google` header):
  `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token`
- **Recommendation:** disable legacy metadata, set
  `disableLegacyEndpoints=true`, restrict SA scopes, SSRF egress controls.
  Ref: GCP metadata security; HackTricks GCP SSRF.

## Phase: Privilege Escalation (service-account centric)

GCP privesc usually abuses an IAM permission to impersonate or modify a more
privileged service account. Common primitives:

| Permission / technique | ATT&CK | Recommendation |
|------------------------|--------|----------------|
| `iam.serviceAccounts.getAccessToken` (impersonation) | T1548 | Restrict SA token creator role |
| `iam.serviceAccounts.actAs` + deploy | T1078.004 | Constrain actAs to specific SAs |
| `iam.serviceAccountKeys.create` | T1098.001 | Disable SA key creation org-wide |
| `iam.serviceAccounts.signJwt` / `signBlob` | T1548 | Limit signer permissions |
| `setIamPolicy` on resource/project | T1098 | Restrict who can set IAM policy |
| **Cloud Batch `batch.jobs.create` + SA** | T1078.004 | Constrain SA usable by Batch; least-priv job SA |
| Cloud Build / Functions / Run deploy with SA | T1078.004 | Scope build/deploy SAs tightly |
| Compute `setMetadata` SSH key injection | T1098.004 | Use OS Login, block project SSH keys |
| Deployment Manager runs as Google-managed SA | T1078.004 | Restrict deploymentmanager perms |

**Steps (Cloud Batch privesc concept — ref HackTricks GCP Batch privesc):**
1. You hold `batch.jobs.create` and can specify a more-privileged service
   account for the job.
2. Create a Batch job that runs a container/command and is bound to that SA.
3. The job executes with the target SA's permissions → escalated access.
- **Recommendation:** ensure principals who can create Batch jobs cannot select
  privileged service accounts; apply `iam.serviceAccounts.actAs` constraints and
  Org Policy `constraints/iam.disableServiceAccountKeyCreation`. Ref:
  cloud.hacktricks.xyz GCP Batch privesc.

**Steps (impersonation):**
- `gcloud ... --impersonate-service-account=TARGET_SA@PROJECT.iam.gserviceaccount.com`
- **Recommendation:** audit `roles/iam.serviceAccountTokenCreator` grants.

## Phase: Persistence / Evasion / Exfiltration

| Technique | ATT&CK | Recommendation |
|-----------|--------|----------------|
| New SA keys / IAM bindings | T1098 | Alert on IAM changes; disable key creation |
| Cloud Function/Scheduler backdoor | T1546 | Review functions, triggers, schedulers |
| Disable/alter audit logs | T1562.008 | Protect logging via Org Policy |
| GCS data exfil | T1530, T1537 | Uniform bucket-level access, VPC-SC, no public ACLs |
| BigQuery data exfil | T1537 | VPC Service Controls, column-level security |

- **Recommendation:** **VPC Service Controls** perimeters around sensitive data,
  Org Policies, CMEK, and least-privilege SAs. Ref: GCP VPC-SC; ScoutSuite/Prowler.

## Cross-references
- GKE specifics: `domains/kubernetes.md`
- Hybrid trust: `domains/hybrid-infrastructure.md`
- Frameworks/fixes/citations: `frameworks/`, `recommendations/`
