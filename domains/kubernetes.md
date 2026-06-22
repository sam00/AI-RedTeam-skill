# Domain: Kubernetes & Containers

> Authorized testing only, scoped to the clusters in your rules of engagement.

## Tooling quick reference

| Tool | Purpose | Install |
|------|---------|---------|
| kubectl | Cluster interaction | https://kubernetes.io/docs/tasks/tools/ |
| kube-hunter | Cluster attack-surface discovery | https://github.com/aquasecurity/kube-hunter |
| kube-bench | CIS benchmark checks | https://github.com/aquasecurity/kube-bench |
| Peirates | K8s pentest / privesc toolkit | https://github.com/inguardians/peirates |
| Trivy | Image/IaC/cluster vuln scanning | https://github.com/aquasecurity/trivy |
| kubeaudit / kubescape | RBAC & posture auditing | github |
| BadPods | Privileged pod manifests (research) | https://github.com/BishopFox/badPods |
| amicontained | Container capability detection | https://github.com/genuinetools/amicontained |

## Phase: Reconnaissance / Discovery

| Technique | ATT&CK | Tools |
|-----------|--------|-------|
| API server / kubelet exposure | T1133, T1046 | kube-hunter, nmap |
| Service account token discovery | T1552.001 | `cat /var/run/secrets/kubernetes.io/...` |
| RBAC enumeration / `can-i` | T1069 | `kubectl auth can-i --list`, kubectl-who-can |
| Secrets & configmaps enum | T1552 | `kubectl get secrets -A` |
| Image/registry inventory | T1525 | trivy, crane |

**Steps:**
1. From a pod, check identity & rights: `kubectl auth can-i --list`
2. Token location: `/var/run/secrets/kubernetes.io/serviceaccount/token`
3. Surface scan: `kube-hunter --remote API_SERVER` (authorized only).
- **Recommendation:** restrict API/kubelet network exposure, disable anonymous
  auth, scope SA token automount off by default. Ref: CIS Kubernetes Benchmark.

## Phase: Initial Access / Execution

| Technique | ATT&CK | Recommendation |
|-----------|--------|----------------|
| Exposed dashboard / API w/o auth | T1133 | AuthN/Z on all endpoints, network policy |
| Vulnerable app in pod → RCE | T1190 | Patch, minimal images, runtime policy |
| Malicious/poisoned image | T1525 | Signed images (cosign), admission control |
| `kubectl exec` into pod | T1609 | Restrict exec RBAC, audit logs |

## Phase: Privilege Escalation / Container Escape

| Technique | ATT&CK | Recommendation |
|-----------|--------|----------------|
| Privileged pod / `hostPID`/`hostNetwork` | T1610, TA0004 | Pod Security Admission `restricted`; deny privileged |
| `hostPath` mount of node FS | T1610 | Disallow hostPath; OPA/Kyverno policy |
| Excessive capabilities (`CAP_SYS_ADMIN`) | T1611 | Drop all caps, add only needed |
| Mount node `/var/run/docker.sock` | T1610 | Never mount socket into pods |
| SA bound to cluster-admin | T1078 | Least-priv RBAC, no wildcard roles |
| Node compromise → cloud IAM (IRSA/Workload Identity) | T1078.004 | Scope node/pod cloud identity tightly |

**Steps (privileged pod escape concept):**
1. Identify ability to create pods or an existing privileged pod.
2. A privileged pod with `hostPID`/`hostPath` can access the node filesystem
   and namespaces → node-level access.
3. From the node, reach other pods, secrets, and cloud metadata/IAM.
- **Recommendation:** enforce **Pod Security Admission (restricted)**, admission
  policies (Kyverno/OPA Gatekeeper), drop capabilities, no hostPath/hostPID,
  read-only root FS. Ref: Kubernetes Pod Security Standards; BishopFox BadPods.

## Phase: Lateral Movement / Collection / Exfiltration

| Technique | ATT&CK | Recommendation |
|-----------|--------|----------------|
| Pod-to-pod movement | T1021 | NetworkPolicies (default deny) |
| Steal SA tokens for cloud APIs | T1552 | Short-lived tokens, projected SA tokens |
| etcd access (secrets in clear) | T1552 | Encrypt etcd at rest, restrict access |
| Exfil via egress | TA0010 | Egress NetworkPolicy + monitoring |

## Supply chain
- Scan images/IaC: `trivy image IMAGE`, `trivy config .`
- **Recommendation:** SBOMs, signed images (Sigstore/cosign), admission
  verification, pinned digests. Ref: SLSA; CNCF supply-chain guidance.

## Cross-references
- Cloud-managed clusters: `domains/cloud-aws.md` (EKS), `domains/cloud-gcp.md` (GKE)
- Frameworks/fixes/citations: `frameworks/`, `recommendations/`
