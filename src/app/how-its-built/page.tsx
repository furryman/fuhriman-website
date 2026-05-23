import Link from 'next/link'
import ArchitectureDiagram from '@/components/ArchitectureDiagram'
import CollapsibleCode from '@/components/CollapsibleCode'
import MagneticButton from '@/components/MagneticButton'
import ScrollReveal from '@/components/ScrollReveal'
import TiltCard from '@/components/TiltCard'
import styles from './page.module.css'

export const metadata = {
  title: 'How I Built This | Fuhriman',
  description:
    'Technical deep-dive: a portfolio site deployed on AWS Graviton (ARM) with k3s, Gateway API via Envoy Gateway, ArgoCD GitOps, Terraform, Packer-built AMIs, and zero-trust admin via SSM Session Manager.',
}

const techStack = [
  { name: 'Next.js', category: 'Frontend', description: 'React framework for the website' },
  {
    name: 'Docker',
    category: 'Container',
    description: 'Multi-stage build → distroless runtime, multi-arch (amd64 + arm64)',
  },
  { name: 'k3s', category: 'Orchestration', description: 'Lightweight Kubernetes on a single EC2' },
  {
    name: 'Envoy Gateway',
    category: 'Networking',
    description: 'Gateway API implementation — replaces ingress-nginx',
  },
  {
    name: 'cert-manager',
    category: 'TLS',
    description: "Let's Encrypt via gatewayHTTPRoute solver",
  },
  {
    name: 'ExternalDNS',
    category: 'DNS',
    description: 'Writes Route53 records from Gateway/HTTPRoute annotations',
  },
  { name: 'ArgoCD', category: 'GitOps', description: 'App-of-Apps continuous deployment from Git' },
  {
    name: 'Terraform',
    category: 'IaC',
    description: 'AWS infrastructure with S3 state + native locking',
  },
  {
    name: 'Packer',
    category: 'Immutable Infra',
    description: 'Pre-bakes k3s + helm into a versioned AMI; ~60s cold-start',
  },
  {
    name: 'GitHub Actions',
    category: 'CI/CD',
    description: 'OIDC-authenticated builds; multi-arch image + AMI pipelines',
  },
  {
    name: 'AWS SSM',
    category: 'Admin Access',
    description: 'Session Manager: no SSH, no inbound 22/6443',
  },
  {
    name: 'AWS Graviton',
    category: 'Compute',
    description: 't4g.medium (ARM) — ~20% cheaper than equivalent x86',
  },
  {
    name: 'AWS DLM',
    category: 'Backups',
    description: 'Native EBS snapshot lifecycle — monthly × 3 retention',
  },
  {
    name: 'Route53',
    category: 'DNS',
    description: 'Public zone; Squarespace delegates via NS records',
  },
]

export default function HowItsBuilt() {
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.backLink}>
          ← Back to Portfolio
        </Link>
      </nav>

      <header className={styles.header}>
        <ScrollReveal>
          <h1 className={`gradient-text ${styles.pageTitle}`}>How I Built This</h1>
        </ScrollReveal>
        <ScrollReveal>
          <p className={styles.subtitle}>
            A technical deep-dive into the infrastructure and CI/CD pipeline powering this portfolio
          </p>
        </ScrollReveal>
      </header>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>Architecture Overview</h2>
        </ScrollReveal>
        <ScrollReveal>
          <ArchitectureDiagram />
          <p className={styles.architectureNote}>
            <strong>Cost-Optimized Design:</strong> A single t4g.medium EC2 (ARM Graviton, 4GB RAM,
            ~$24/mo) runs k3s instead of managed EKS. Plus an Elastic IP, Route53 zone, S3 state
            backend, monthly EBS snapshots, and Packer-baked AMI storage. Total:{' '}
            <strong>~$31/mo</strong>, well under the $40/mo budget alert and ~60% cheaper than EKS
            at this scale.
          </p>
        </ScrollReveal>
      </section>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>Technology Stack</h2>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.techGrid}>
            {techStack.map((tech) => (
              <TiltCard key={tech.name} className={styles.techCard}>
                <span className={styles.techCategory}>{tech.category}</span>
                <h3>{tech.name}</h3>
                <p>{tech.description}</p>
              </TiltCard>
            ))}
          </div>
        </ScrollReveal>
      </section>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>Infrastructure as Code</h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className={styles.sectionIntro}>
            The entire AWS infrastructure is defined in Terraform, organized into reusable modules:
          </p>
          <div className={styles.codeBlock}>
            <div className={styles.codeHeader}>terraform/</div>
            <pre>{`terraform/
├── tf-modules/
│   ├── aws-vpc/                # VPC, public subnet, IGW, route table
│   ├── aws-k3s/                # EC2 t4g.medium, EIP, SG, IAM role w/ SSM,
│   │                           #   user_data.sh runtime bootstrap
│   └── aws-dns/                # Route53 public hosted zone for fuhriman.org
├── packer/
│   ├── k3s-portfolio.pkr.hcl   # AL2023 arm64 + k3s + helm + ssm-agent
│   └── scripts/                # Provisioner scripts
├── .github/workflows/
│   └── build-ami.yml           # OIDC-auth Packer builds + 3-AMI retention
├── docs/plans/                 # Architecture design + manual-steps docs
├── main.tf                     # Module composition + IAM policies
├── backend.tf                  # S3 + native use_lockfile (no DynamoDB)
├── budget.tf                   # $40/mo AWS budget alert
├── dlm.tf                      # Monthly EBS snapshots × 3 retention
├── oidc.tf                     # GitHub Actions OIDC trust + Packer IAM role
├── providers.tf                # AWS provider ~> 6.31 with default_tags
└── variables.tf                # Configuration with validation blocks`}</pre>
          </div>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <h4>VPC Module</h4>
              <p>
                Simple VPC (10.0.0.0/16) with a single public subnet in one AZ. No NAT Gateway
                needed — everything runs in the public subnet. Honest single-AZ slicing (no
                misleading multi-AZ data sources).
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>k3s Module</h4>
              <p>
                Single t4g.medium (4GB ARM Graviton) launched from a{' '}
                <strong>Packer-baked AMI</strong> with k3s, helm, and the SSM Agent pre-installed.
                The runtime <code>user_data.sh</code> is just ~55 lines: fetch the public IP from
                IMDSv2, wire k3s&apos;s <code>--tls-san</code>, install ArgoCD, hand off to
                App-of-Apps. Cold-start to <code>argocd-server</code> Running: ~60 seconds.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>DNS Module</h4>
              <p>
                A single Route53 public hosted zone for fuhriman.org. Squarespace is the registrar
                only — NS records delegate to Route53. ExternalDNS in-cluster manages records
                automatically based on HTTPRoute hostnames.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>Zero-Trust Admin Access</h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className={styles.sectionIntro}>
            There&apos;s no SSH server reachable from the internet. There&apos;s no public
            kube-apiserver. Admin happens entirely through AWS Systems Manager Session Manager.
          </p>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <h4>Security Group</h4>
              <p>
                Inbound: <strong>only 80 and 443</strong>. No 22 (SSH), no 6443 (k8s API), no
                NodePort 30443. The EC2 instance has no <code>aws_key_pair</code> resource at all.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>Interactive Shell</h4>
              <p>
                <code>aws ssm start-session --target $INSTANCE_ID</code>. IAM-authenticated,
                CloudTrail-audited. The EC2 instance role has{' '}
                <code>AmazonSSMManagedInstanceCore</code> attached.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>kubectl via SSM Tunnel</h4>
              <p>
                <code>start-session --document-name AWS-StartPortForwardingSession</code> forwards{' '}
                <code>localhost:6443</code> over SSM to the in-cluster API server. Local kubectl
                then runs against a kubeconfig that points at localhost. No public k8s API needed.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>IMDSv2 Enforced</h4>
              <p>
                Instance metadata requires <code>http_tokens=required</code> with
                <code>http_put_response_hop_limit=2</code>. Defeats SSRF-style attacks that could
                otherwise reach IMDS via a compromised pod.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>Routing with Gateway API</h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className={styles.sectionIntro}>
            The cluster doesn&apos;t use <code>Ingress</code> resources at all. Routing is handled
            by the Kubernetes <strong>Gateway API</strong> (GA since 1.29) implemented by Envoy
            Gateway. ExternalDNS reads HTTPRoute resources and publishes Route53 records
            automatically; cert-manager issues Let&apos;s Encrypt certs via the{' '}
            <code>gatewayHTTPRoute</code> HTTP-01 solver.
          </p>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <h4>GatewayClass + Gateway</h4>
              <p>
                Single <code>GatewayClass</code> named <code>envoy</code>, controlled by Envoy
                Gateway. One shared <code>Gateway</code> named <code>public</code> in{' '}
                <code>envoy-gateway-system</code> with HTTP :80 and HTTPS :443 listeners that
                terminate TLS using a multi-SAN cert.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>HTTPRoute per Service</h4>
              <p>
                The website chart declares <code>fuhriman.org</code> + <code>www.fuhriman.org</code>{' '}
                as HTTPRoute hostnames attaching to the public Gateway. The ArgoCD chart adds{' '}
                <code>argocd.fuhriman.org</code> the same way. ExternalDNS picks both up.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>Multi-SAN Let&apos;s Encrypt Cert</h4>
              <p>
                One <code>Certificate</code> resource covers all three hostnames. cert-manager
                issues via HTTP-01, creating a temporary HTTPRoute through the public Gateway for
                the ACME challenge. Auto-renews 30 days before expiry. <code>R13</code>{' '}
                intermediate.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>klipper-lb + EIP Override</h4>
              <p>
                k3s ships <code>klipper-lb</code> as its default Service LoadBalancer, which
                advertises the node&apos;s <em>private</em> IP — not what we want ExternalDNS
                publishing to Route53. The fix is one annotation on the Gateway:{' '}
                <code>external-dns.alpha.kubernetes.io/target: 52.37.95.130</code> (the Elastic IP).
                One line, no extra LoadBalancer controller.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>GitOps with ArgoCD</h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className={styles.sectionIntro}>
            ArgoCD implements the GitOps pattern where Git is the single source of truth for the
            desired cluster state.
          </p>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.gitopsFlow}>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h4>App of Apps Pattern</h4>
                <p>
                  A parent Application bootstrapped by <code>user_data.sh</code> manages four child
                  Applications: cert-manager, envoy-gateway, external-dns, fuhriman-website.
                </p>
              </div>
            </div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h4>Sync Waves</h4>
                <p>
                  cert-manager (-2) installs first (it owns the cert CRDs). envoy-gateway (-1)
                  follows. external-dns + fuhriman-website (0) deploy together. Wave numbers
                  guarantee dependency order.
                </p>
              </div>
            </div>
            <div className={styles.flowStep}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h4>Auto-Sync &amp; Self-Heal</h4>
                <p>
                  ArgoCD automatically applies Git changes and reverts any manual cluster
                  modifications back to the declared state.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>CI/CD Pipeline</h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className={styles.sectionIntro}>
            Every push to <code>main</code> triggers a fully automated build and deployment
            pipeline:
          </p>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.pipeline}>
            <div className={styles.pipelineStep}>
              <div className={styles.pipelineIcon}>1</div>
              <h4>Quality Gates</h4>
              <p>
                Six jobs run in parallel: Biome 2 (lint + format), TypeScript, Vitest with a 95%
                coverage gate, Next.js build, Playwright smoke, and Lighthouse CI. All must pass.
              </p>
            </div>
            <div className={styles.pipelineArrow}>→</div>
            <div className={styles.pipelineStep}>
              <div className={styles.pipelineIcon}>2</div>
              <h4>Build &amp; Push (Multi-Arch)</h4>
              <p>
                Multi-stage Docker build with QEMU emulation produces a{' '}
                <strong>multi-arch image</strong> (linux/amd64 + linux/arm64) → distroless runtime.
                Pushed to Docker Hub with a timestamp tag (<code>ga-YYYY.MM.DD-HHMM</code>) and{' '}
                <code>latest</code>.
              </p>
            </div>
            <div className={styles.pipelineArrow}>→</div>
            <div className={styles.pipelineStep}>
              <div className={styles.pipelineIcon}>3</div>
              <h4>Scan</h4>
              <p>
                Trivy v0.69.3 (SHA-pinned) scans the pushed image for CRITICAL and HIGH CVEs with
                ignore-unfixed enabled. The pipeline fails if any fixable vulnerabilities surface.
              </p>
            </div>
            <div className={styles.pipelineArrow}>→</div>
            <div className={styles.pipelineStep}>
              <div className={styles.pipelineIcon}>4</div>
              <h4>Update</h4>
              <p>
                <code>yq</code> updates <code>fuhriman-chart/values.yaml</code> in eks-helm-charts
                with the new image tag; ArgoCD detects the commit and syncs the change to the k3s
                cluster.
              </p>
            </div>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <CollapsibleCode
            header=".github/workflows/build-deploy.yaml"
            collapsedHeight="20em"
            code={`name: Build and Deploy
on:
  push:
    branches: [main]

permissions:
  contents: read           # Least-privilege security

jobs:
  # Six parallel quality gates — all must pass before docker runs
  lint:        # biome check (lint + format)
  typecheck:   # tsc --noEmit
  test:        # vitest run --coverage  (95/95/95/95 gate)
  build:       # next build --output standalone
  e2e:         # playwright against built standalone
  lighthouse:  # perf >= 90, a11y >= 0.95, BP >= 95, SEO >= 95

  docker:
    needs: [lint, typecheck, test, build, e2e, lighthouse]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd7190...           # SHA-pinned
      - uses: pnpm/action-setup@a7487c7e...          # corepack-pinned pnpm
      - run: echo "tag=ga-$(date +'%Y.%m.%d-%H%M')" >> $GITHUB_OUTPUT

      - uses: docker/login-action@650006c6...
      - uses: docker/setup-qemu-action@49b3bc8e...   # arm64 emulation
      - uses: docker/setup-buildx-action@d7f5e7f5...
      - uses: docker/build-push-action@f9f3042f...
        with:
          push: true
          platforms: linux/amd64,linux/arm64         # Multi-arch for Graviton
          tags: furryman/fuhriman-website:${'${{ steps.tag.outputs.tag }}'},latest

      # Trivy v0.69.3 (binary pinned; addresses GHSA-69fq-xp46-6x23)
      - uses: aquasecurity/trivy-action@a9c7b0f0...  # SHA-pinned
        with:
          severity: CRITICAL,HIGH
          ignore-unfixed: true
          exit-code: 1

  deploy:
    needs: docker
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11bd7190...
        with:
          repository: furryman/eks-helm-charts
          token: ${'${{ secrets.GH_PAT }}'}              # repo scope — fires downstream workflows
      - run: yq -i '.image.tag = "..."' fuhriman-chart/values.yaml
      - run: git commit -am "Bump image" && git push   # ArgoCD picks this up`}
          />
        </ScrollReveal>
      </section>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>Immutable Infrastructure with Packer</h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className={styles.sectionIntro}>
            The EC2 instance launches from a custom AMI built by Packer. k3s, helm, the SSM Agent,
            and Helm repo caches are pre-baked. <code>user_data.sh</code> only does what depends on
            the running instance&apos;s identity.
          </p>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <h4>Cold-Start Math</h4>
              <p>
                Pre-Packer: ~5–10 minutes from instance launch to a working ArgoCD (dnf updates, k3s
                download, helm install, repo adds, then chart installs). Packer-baked AMI:{' '}
                <strong>~60 seconds</strong> to argocd-server Running, <strong>~3 minutes</strong>{' '}
                to full convergence with all certs issued.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>OIDC, Not Long-Lived Keys</h4>
              <p>
                The build-ami.yml workflow assumes an IAM role via GitHub OIDC.{' '}
                <code>github-actions-packer</code> has a trust policy scoped to{' '}
                <code>repo:furryman/terraform:*</code>. No AWS access keys live in GitHub Secrets.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>3-AMI Retention</h4>
              <p>
                The workflow&apos;s last step lists Packer-tagged AMIs and deregisters everything
                beyond the 3 most recent (snapshot cleanup included). Storage stays bounded at
                ~$0.30/mo for AMI snapshots, dedup&apos;d against existing DLM snapshots.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>Backups &amp; Observability Tradeoffs</h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className={styles.sectionIntro}>
            A single-node portfolio cluster doesn&apos;t need everything a production fleet does.
            Two deliberate calls: keep backups cheap and visible, and don&apos;t pay for
            observability that nothing acts on.
          </p>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <h4>AWS DLM — Monthly × 3 EBS Snapshots</h4>
              <p>
                <code>aws_dlm_lifecycle_policy</code> (Data Lifecycle Manager, native AWS — no
                third-party scheduler) takes a snapshot of the root EBS volume on the 1st of each
                month at 04:00 UTC and retains the 3 most recent. Cost: pennies per month. Recovery
                time: a few minutes to launch a new instance from a chosen snapshot. DLM was picked
                over AWS Backup for cost (DLM has no per-protected-resource pricing) and over
                Velero/restic for simplicity (no in-cluster moving parts).
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>$40/mo Budget Alert</h4>
              <p>
                An AWS Budget watches actual spend against the cost model (~$31/mo target, $40/mo
                alert). If anything regresses — orphaned EIPs, runaway DLM snapshots, an
                instance-type drift — email lands before the AWS bill does.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>No Prometheus (by choice)</h4>
              <p>
                A Prometheus + Grafana stack would add ~512 MiB of memory pressure to a 4 GB node
                and would never be acted on for a portfolio site. Chart values disable Prometheus
                metric emitters across envoy-gateway and external-dns. If something genuinely
                breaks, <code>kubectl logs</code> and CloudWatch Container Insights for the
                ec2-level signals are enough. This is a deliberate tradeoff, not negligence.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>Kubernetes Resources</h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className={styles.sectionIntro}>
            The website runs as a Deployment with associated Service and HTTPRoute resources:
          </p>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.k8sResources}>
            <div className={styles.k8sResource}>
              <h4>Deployment</h4>
              <ul>
                <li>1 replica (sufficient for single-node cluster)</li>
                <li>Resource limits: 100m CPU, 128Mi memory</li>
                <li>Liveness and readiness probes on port 3000</li>
                <li>Rolling update strategy with health checks</li>
                <li>Multi-arch image — runs on the Graviton instance</li>
              </ul>
            </div>
            <div className={styles.k8sResource}>
              <h4>Service</h4>
              <ul>
                <li>ClusterIP type for internal access</li>
                <li>Port 80 → target port 3000</li>
                <li>Label selector for pod discovery</li>
              </ul>
            </div>
            <div className={styles.k8sResource}>
              <h4>HTTPRoute (Gateway API)</h4>
              <ul>
                <li>
                  Attaches to the shared <code>public</code> Gateway via <code>parentRefs</code>
                </li>
                <li>Hostnames: fuhriman.org, www.fuhriman.org</li>
                <li>TLS terminates at the Gateway (not the Service)</li>
                <li>
                  Path prefix <code>/</code> → backend Service port 80
                </li>
                <li>ExternalDNS reads the hostnames and writes Route53 A records</li>
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>Repository Structure</h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className={styles.sectionIntro}>
            The project is organized across 4 repositories following separation of concerns:
          </p>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.repos}>
            <TiltCard className={styles.repoCard}>
              <a
                href="https://github.com/furryman/terraform"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4>furryman/terraform</h4>
                <p>
                  AWS infrastructure: VPC, EC2 t4g.medium (ARM Graviton) launched from a
                  Packer-built AMI, Route53 zone, S3 state with native locking, SSM-only admin, and
                  OIDC trust for GitHub Actions Packer builds.
                </p>
                <span className={styles.repoTag}>Terraform</span>
              </a>
            </TiltCard>
            <TiltCard className={styles.repoCard}>
              <a
                href="https://github.com/furryman/eks-helm-charts"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4>furryman/eks-helm-charts</h4>
                <p>
                  Helm charts for cert-manager, Envoy Gateway (Gateway API), ExternalDNS, and the
                  fuhriman-website deployment. Repo name is vestigial — target is k3s, not EKS.
                </p>
                <span className={styles.repoTag}>Helm</span>
              </a>
            </TiltCard>
            <TiltCard className={styles.repoCard}>
              <a
                href="https://github.com/furryman/argocd-app-of-apps"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4>furryman/argocd-app-of-apps</h4>
                <p>
                  Parent ArgoCD Application managing four child Applications with sync waves and
                  auto-sync enabled.
                </p>
                <span className={styles.repoTag}>ArgoCD</span>
              </a>
            </TiltCard>
            <TiltCard className={styles.repoCard}>
              <a
                href="https://github.com/furryman/fuhriman-website"
                target="_blank"
                rel="noopener noreferrer"
              >
                <h4>furryman/fuhriman-website</h4>
                <p>
                  Next.js 16 + React 19 source. Multi-stage Dockerfile → distroless multi-arch image
                  (amd64+arm64) and a 6-job parallel GitHub Actions CI/CD pipeline.
                </p>
                <span className={styles.repoTag}>Next.js</span>
              </a>
            </TiltCard>
          </div>
        </ScrollReveal>
      </section>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>The Migration Story</h2>
        </ScrollReveal>
        <ScrollReveal>
          <p className={styles.sectionIntro}>
            The architecture above didn&apos;t spring fully-formed — it&apos;s the end state of a{' '}
            <strong>nine-phase refactor</strong> from an earlier setup. The git history (and the
            design + manual-steps docs in <code>furryman/terraform/docs/plans/</code>) tells the
            full story; the highlights:
          </p>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.highlights}>
            <div className={styles.highlight}>
              <h4>From ingress-nginx to Gateway API</h4>
              <p>
                The original cluster ran ingress-nginx with an iptables hairpin-NAT hack to make
                cert-manager&apos;s HTTP-01 self-checks succeed on a single-instance VPC. Phase 4
                replaced both with Envoy Gateway + Gateway API — same outcome, modern primitives, no
                iptables.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>Sized up for the new components</h4>
              <p>
                t3.small (2GB x86) hit memory pressure under Envoy Gateway + the ArgoCD chart 9 bump
                (argocd-server got OOM-killed mid-Phase-4). Phase 3.5 migrated to t4g.medium (4GB
                ARM Graviton) — more memory + ARM cost savings in one swap.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>SSH replaced by SSM</h4>
              <p>
                Phase 2 removed inbound 22 and 6443 entirely. No SSH server reachable from the
                internet; no public kube-apiserver. Admin is IAM-authenticated SSM, fully audited
                through CloudTrail.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>State migrated to S3 (no DynamoDB)</h4>
              <p>
                Terraform 1.15+ supports native S3 state locking via <code>use_lockfile</code>.
                Phase 0 migrated from local state, skipping the deprecated DynamoDB lock-table
                pattern entirely.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>ArgoCD chart 5.55 → 9.5.x</h4>
              <p>
                Four major chart versions in one go (Phase 5). ArgoCD v3.x with refreshed UI,
                argocd-redis-secret-init, and Gateway-API-ready service shapes. Held a snapshot for
                rollback; chart upgrade landed clean on the first try.
              </p>
            </div>
            <div className={styles.highlight}>
              <h4>From imperative cloud-init to Packer-built AMI</h4>
              <p>
                The original bootstrap took ~5–10 minutes per instance launch. Phase 7 baked k3s,
                helm, ssm-agent, and helm repo caches into a versioned AMI. Cold-start dropped to
                ~60 seconds. The full Packer pipeline took 8 build attempts to settle — each fix in
                git history.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className={styles.section}>
        <ScrollReveal>
          <h2>Key DevOps Principles</h2>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.principles}>
            <div className={styles.principle}>
              <h4>Infrastructure as Code</h4>
              <p>
                All infrastructure is version-controlled in Terraform, enabling reproducible
                deployments and peer review of changes. Variables have <code>validation</code>{' '}
                blocks; providers are pinned with <code>~&gt;</code> constraints.
              </p>
            </div>
            <div className={styles.principle}>
              <h4>GitOps</h4>
              <p>
                Git is the single source of truth. All changes flow through commits, providing audit
                trails and rollback capabilities. ArgoCD&apos;s self-heal reverts manual cluster
                edits automatically.
              </p>
            </div>
            <div className={styles.principle}>
              <h4>Immutable Infrastructure</h4>
              <p>
                Both container images and the host AMI are immutable artifacts with versioned tags.
                Packer rebuilds the AMI; <code>user_data_replace_on_change=true</code> means a new
                bootstrap script always lands on a fresh instance.
              </p>
            </div>
            <div className={styles.principle}>
              <h4>Declarative Configuration</h4>
              <p>
                Desired state is declared in YAML (HTTPRoutes, Applications, Certificates,
                Gateways). Kubernetes and ArgoCD continuously reconcile actual state to match.
              </p>
            </div>
            <div className={styles.principle}>
              <h4>Cost Optimization</h4>
              <p>
                k3s on a single t4g.medium (ARM Graviton) keeps the bill at ~$31/mo vs ~$80+ for
                managed EKS at equivalent scale. ARM saves ~20% over x86 at the same memory tier
                with no observable performance loss for this workload.
              </p>
            </div>
            <div className={styles.principle}>
              <h4>Least Privilege &amp; Zero Trust</h4>
              <p>
                SSM-only admin (no SSH, no public k8s API). IMDSv2 enforced. GitHub Actions OIDC
                instead of long-lived keys. IAM policies scoped narrowly (ExternalDNS to one zone,
                Packer to specific EC2 actions).
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>

      <footer className={styles.footer}>
        <MagneticButton href="/" className="btn">
          ← Back to Portfolio
        </MagneticButton>
        <p>This page is part of the portfolio at fuhriman.org</p>
      </footer>
    </main>
  )
}
