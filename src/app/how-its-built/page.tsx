import styles from './page.module.css'
import Link from 'next/link'

export const metadata = {
  title: 'How I Built This | Fuhriman',
  description: 'Technical deep-dive into how this portfolio website is deployed using k3s, ArgoCD, Terraform, and GitHub Actions on a single EC2 instance.',
}

const techStack = [
  { name: 'Next.js', category: 'Frontend', description: 'React framework for the website' },
  { name: 'Docker', category: 'Container', description: 'Multi-arch builds (AMD64/ARM64)' },
  { name: 'k3s', category: 'Orchestration', description: 'Lightweight Kubernetes on EC2' },
  { name: 'ArgoCD', category: 'GitOps', description: 'Continuous deployment from Git' },
  { name: 'Terraform', category: 'IaC', description: 'Infrastructure as Code for AWS' },
  { name: 'GitHub Actions', category: 'CI/CD', description: 'Build and push automation' },
  { name: 'cert-manager', category: 'TLS', description: 'Let\'s Encrypt certificates' },
  { name: 'ingress-nginx', category: 'Networking', description: 'Traffic routing and TLS termination' },
]

export default function HowItsBuilt() {
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.backLink}>← Back to Portfolio</Link>
      </nav>

      <header className={styles.header}>
        <h1 className="gradient-text">How I Built This</h1>
        <p className={styles.subtitle}>
          A technical deep-dive into the infrastructure and CI/CD pipeline powering this portfolio
        </p>
      </header>

      <section className={styles.section}>
        <h2>Architecture Overview</h2>
        <div className={styles.diagram}>
          <pre>{`
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Developer Workflow                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ git push
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             GitHub Actions CI/CD                            │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   Checkout  │───▶│ Build Image │───▶│Push to DHub|───▶│Update Helm │   │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
                    ▼                                   ▼
          ┌─────────────────┐                ┌─────────────────────┐
          │   Docker Hub    │                │   eks-helm-charts   │
          │  (Image Store)  │                │  (values.yaml)      │
          └─────────────────┘                └─────────────────────┘
                    │                                   │
                    │                                   │ watches
                    │                                   ▼
                    │                       ┌─────────────────────┐
                    │                       │       ArgoCD        │
                    │                       │   (GitOps Engine)   │
                    │                       └─────────────────────┘
                    │                                   │
                    │                                   │ deploys
                    ▼                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          AWS EC2 t3.small (k3s)                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Kubernetes (k3s) Workloads                       │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────────┐    │    │
│  │  │cert-manager │  │ingress-nginx│  │   fuhriman-website        │    │    │
│  │  │(Let's Enc.) │  │(ServiceLB)  │  │   (This Website!)         │    │    │
│  │  └─────────────┘  └─────────────┘  └───────────────────────────┘    │    │
│  │                                                                     │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │ iptables: Hairpin NAT fix (pod CIDR → kube-proxy chains)    │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                            https://fuhriman.org
`}</pre>
        </div>
        <p className={styles.architectureNote}>
          <strong>Cost-Optimized Design:</strong> A single t3.small EC2 instance (2GB RAM, $17/mo)
          runs k3s (lightweight Kubernetes) instead of managed EKS. No NAT Gateway or multiple
          nodes needed, reducing costs from ~$80/mo to ~$22/mo while maintaining GitOps best practices.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Technology Stack</h2>
        <div className={styles.techGrid}>
          {techStack.map((tech) => (
            <div key={tech.name} className={styles.techCard}>
              <span className={styles.techCategory}>{tech.category}</span>
              <h3>{tech.name}</h3>
              <p>{tech.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Infrastructure as Code</h2>
        <p className={styles.sectionIntro}>
          The entire AWS infrastructure is defined in Terraform, organized into reusable modules:
        </p>
        <div className={styles.codeBlock}>
          <div className={styles.codeHeader}>terraform/</div>
          <pre>{`terraform/
├── tf-modules/
│   ├── aws-vpc/           # VPC, public subnet, Internet Gateway
│   └── aws-k3s/           # EC2 instance, k3s, ArgoCD (cloud-init)
├── main.tf                # Module composition
├── providers.tf           # AWS provider configuration
├── backend.tf             # S3 state with DynamoDB locking
├── budget.tf              # AWS budget alert ($25/mo)
└── variables.tf           # Configuration variables`}</pre>
        </div>
        <div className={styles.highlights}>
          <div className={styles.highlight}>
            <h4>VPC Module</h4>
            <p>Creates a simple VPC (10.0.0.0/16) with a single public subnet in one availability zone. No NAT Gateway needed since everything runs in the public subnet, significantly reducing costs.</p>
          </div>
          <div className={styles.highlight}>
            <h4>k3s Module</h4>
            <p>Provisions a single t3.small EC2 instance (2GB RAM) and installs k3s (lightweight Kubernetes) via cloud-init. ArgoCD is deployed via Helm during instance bootstrap, eliminating the need for managed EKS.</p>
          </div>
          <div className={styles.highlight}>
            <h4>Hairpin NAT Fix</h4>
            <p>Installs iptables rules that jump pod CIDR traffic destined for the public IP directly into kube-proxy&apos;s KUBE-EXT chains. This solves the AWS hairpin NAT problem for cert-manager HTTP-01 validation at the network layer.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>GitOps with ArgoCD</h2>
        <p className={styles.sectionIntro}>
          ArgoCD implements the GitOps pattern where Git is the single source of truth for the desired cluster state.
        </p>
        <div className={styles.gitopsFlow}>
          <div className={styles.flowStep}>
            <div className={styles.stepNumber}>1</div>
            <div className={styles.stepContent}>
              <h4>App of Apps Pattern</h4>
              <p>A parent Application manages child Applications, enabling hierarchical deployment of the entire stack.</p>
            </div>
          </div>
          <div className={styles.flowStep}>
            <div className={styles.stepNumber}>2</div>
            <div className={styles.stepContent}>
              <h4>Sync Waves</h4>
              <p>Applications deploy in order: cert-manager (-2) → ingress-nginx (-1) → website (0), ensuring dependencies are ready.</p>
            </div>
          </div>
          <div className={styles.flowStep}>
            <div className={styles.stepNumber}>3</div>
            <div className={styles.stepContent}>
              <h4>Auto-Sync & Self-Heal</h4>
              <p>ArgoCD automatically applies Git changes and reverts any manual cluster modifications to maintain desired state.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>CI/CD Pipeline</h2>
        <p className={styles.sectionIntro}>
          Every push to the main branch triggers a fully automated build and deployment pipeline:
        </p>
        <div className={styles.pipeline}>
          <div className={styles.pipelineStep}>
            <div className={styles.pipelineIcon}>1</div>
            <h4>Build</h4>
            <p>Multi-stage Docker build creates optimized production images for both AMD64 and ARM64 platforms using Docker Buildx.</p>
          </div>
          <div className={styles.pipelineArrow}>→</div>
          <div className={styles.pipelineStep}>
            <div className={styles.pipelineIcon}>2</div>
            <h4>Push</h4>
            <p>Multi-arch manifest is pushed to Docker Hub with a timestamp tag (ga-YYYY.MM.DD-HHMM) for versioning and rollback capability.</p>
          </div>
          <div className={styles.pipelineArrow}>→</div>
          <div className={styles.pipelineStep}>
            <div className={styles.pipelineIcon}>3</div>
            <h4>Update</h4>
            <p>The Helm chart&apos;s values.yaml is updated with the new image tag and committed to eks-helm-charts repository.</p>
          </div>
          <div className={styles.pipelineArrow}>→</div>
          <div className={styles.pipelineStep}>
            <div className={styles.pipelineIcon}>4</div>
            <h4>Deploy</h4>
            <p>ArgoCD detects the Git change and automatically syncs the new image to k3s with rolling update strategy.</p>
          </div>
        </div>
        <div className={styles.codeBlock}>
          <div className={styles.codeHeader}>.github/workflows/build-deploy.yaml</div>
          <pre>{`name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate tag
        run: echo "tag=ga-$(date +'%Y.%m.%d-%H%M')" >> $GITHUB_OUTPUT

      - uses: docker/login-action@v3
      - uses: docker/setup-qemu-action@v3
      - uses: docker/setup-buildx-action@v3

      - uses: docker/build-push-action@v6
        with:
          platforms: linux/amd64,linux/arm64
          push: true
          tags: furryman/fuhriman-website:${'${{ steps.tag.outputs.tag }}'}

      # Update Helm chart and push to trigger ArgoCD
      - uses: actions/checkout@v4
        with:
          repository: furryman/eks-helm-charts
          token: ${'${{ secrets.GH_PAT }}'}

      - run: yq -i '.image.tag = "..."' fuhriman-chart/values.yaml
      - run: git commit -am "Update image" && git push`}</pre>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Kubernetes Resources</h2>
        <p className={styles.sectionIntro}>
          The website runs as a Deployment with associated Service and Ingress resources:
        </p>
        <div className={styles.k8sResources}>
          <div className={styles.k8sResource}>
            <h4>Deployment</h4>
            <ul>
              <li>1 replica (sufficient for single-node cluster)</li>
              <li>Resource limits: 100m CPU, 128Mi memory</li>
              <li>Liveness and readiness probes on port 3000</li>
              <li>Rolling update strategy with health checks</li>
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
            <h4>Ingress</h4>
            <ul>
              <li>NGINX ingress class with LoadBalancer (k3s ServiceLB)</li>
              <li>TLS termination with Let&apos;s Encrypt</li>
              <li>Hosts: fuhriman.org, www.fuhriman.org</li>
              <li>Automatic certificate renewal via cert-manager</li>
              <li>SSL redirect disabled for ACME HTTP-01 challenges</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Repository Structure</h2>
        <p className={styles.sectionIntro}>
          The project is organized across 4 repositories following separation of concerns:
        </p>
        <div className={styles.repos}>
          <a href="https://github.com/furryman/terraform" target="_blank" rel="noopener noreferrer" className={styles.repoCard}>
            <h4>furryman/terraform</h4>
            <p>Infrastructure as Code for AWS VPC, EC2 t3.small, k3s installation, and iptables hairpin NAT fix</p>
            <span className={styles.repoTag}>Terraform</span>
          </a>
          <a href="https://github.com/furryman/eks-helm-charts" target="_blank" rel="noopener noreferrer" className={styles.repoCard}>
            <h4>furryman/eks-helm-charts</h4>
            <p>Helm charts for cert-manager, ingress-nginx, and the website deployment</p>
            <span className={styles.repoTag}>Helm</span>
          </a>
          <a href="https://github.com/furryman/argocd-app-of-apps" target="_blank" rel="noopener noreferrer" className={styles.repoCard}>
            <h4>furryman/argocd-app-of-apps</h4>
            <p>Parent ArgoCD Application managing all child applications with sync waves and auto-sync enabled</p>
            <span className={styles.repoTag}>ArgoCD</span>
          </a>
          <a href="https://github.com/furryman/fuhriman-website" target="_blank" rel="noopener noreferrer" className={styles.repoCard}>
            <h4>furryman/fuhriman-website</h4>
            <p>Next.js source code with multi-arch Dockerfile and GitHub Actions CI/CD workflow</p>
            <span className={styles.repoTag}>Next.js</span>
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Certificate Management & Hairpin NAT Solution</h2>
        <p className={styles.sectionIntro}>
          One of the interesting technical challenges was getting Let&apos;s Encrypt certificates to work on a single-node cluster behind a public IP.
        </p>
        <div className={styles.highlights}>
          <div className={styles.highlight}>
            <h4>The Hairpin NAT Problem</h4>
            <p>When cert-manager validates HTTP-01 challenges, it connects to the public IP from inside the cluster. AWS VPC doesn&apos;t support hairpin NAT — the VPC router won&apos;t loop packets back to the same host — so these connections fail even though external validation works fine.</p>
          </div>
          <div className={styles.highlight}>
            <h4>iptables Network-Layer Fix</h4>
            <p>During cloud-init, the script discovers kube-proxy&apos;s KUBE-EXT chain names for the ingress-nginx LoadBalancer service, then adds iptables rules that jump pod CIDR (10.42.0.0/16) traffic destined for the public IP directly into those chains. This piggybacks on kube-proxy&apos;s existing DNAT-to-pod routing, keeping the fix at the network layer with no application-level workarounds.</p>
          </div>
          <div className={styles.highlight}>
            <h4>Why Not Simple DNAT?</h4>
            <p>iptables DNAT is a terminating target — once it fires, the packet exits the chain. A native DNAT to the private IP would bypass kube-proxy&apos;s service routing rules entirely. By jumping into kube-proxy&apos;s own chains instead, the packet follows the same path as external traffic.</p>
          </div>
        </div>
        <div className={styles.codeBlock}>
          <div className={styles.codeHeader}>iptables Hairpin NAT Rules (from user_data.sh)</div>
          <pre>{`# Discover kube-proxy's chain names for the LoadBalancer service
HTTP_CHAIN=$(iptables -t nat -L KUBE-SERVICES -n \\
  | grep "ingress-nginx-controller:http loadbalancer" | awk '{print $1}')
HTTPS_CHAIN=$(iptables -t nat -L KUBE-SERVICES -n \\
  | grep "ingress-nginx-controller:https loadbalancer" | awk '{print $1}')

# Jump pod traffic to the public IP into kube-proxy's chains
iptables -t nat -A PREROUTING -s 10.42.0.0/16 -d $PUBLIC_IP \\
  -p tcp --dport 80 -j $HTTP_CHAIN
iptables -t nat -A PREROUTING -s 10.42.0.0/16 -d $PUBLIC_IP \\
  -p tcp --dport 443 -j $HTTPS_CHAIN`}</pre>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Key DevOps Principles</h2>
        <div className={styles.principles}>
          <div className={styles.principle}>
            <h4>Infrastructure as Code</h4>
            <p>All infrastructure is version-controlled in Terraform, enabling reproducible deployments and peer review of changes.</p>
          </div>
          <div className={styles.principle}>
            <h4>GitOps</h4>
            <p>Git is the single source of truth. All changes flow through pull requests, providing audit trails and rollback capabilities.</p>
          </div>
          <div className={styles.principle}>
            <h4>Immutable Infrastructure</h4>
            <p>Each deployment creates a new container image with a unique tag. No in-place modifications to running containers.</p>
          </div>
          <div className={styles.principle}>
            <h4>Declarative Configuration</h4>
            <p>Desired state is declared in YAML manifests. Kubernetes and ArgoCD continuously reconcile actual state to match.</p>
          </div>
          <div className={styles.principle}>
            <h4>Cost Optimization</h4>
            <p>Using k3s on a single t3.small instance instead of managed EKS reduces monthly costs from ~$80 to ~$22 while maintaining production-grade GitOps practices.</p>
          </div>
          <div className={styles.principle}>
            <h4>Automation First</h4>
            <p>Certificate renewal, hairpin NAT configuration, and application deployment are fully automated. Zero manual intervention required after initial setup.</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className="btn">Back to Portfolio</Link>
        <p>This page is part of the portfolio at fuhriman.org</p>
      </footer>
    </main>
  )
}
