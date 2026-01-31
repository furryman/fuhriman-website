import styles from './page.module.css'
import Link from 'next/link'

export const metadata = {
  title: 'How It\'s Built | Fuhriman',
  description: 'Technical deep-dive into how this portfolio website is deployed using Kubernetes, ArgoCD, Terraform, and GitHub Actions.',
}

const techStack = [
  { name: 'Next.js', category: 'Frontend', description: 'React framework for the website' },
  { name: 'Docker', category: 'Container', description: 'Multi-stage builds for ARM64' },
  { name: 'Kubernetes', category: 'Orchestration', description: 'Container orchestration on EKS' },
  { name: 'ArgoCD', category: 'GitOps', description: 'Continuous deployment from Git' },
  { name: 'Terraform', category: 'IaC', description: 'Infrastructure as Code for AWS' },
  { name: 'GitHub Actions', category: 'CI/CD', description: 'Build and push automation' },
  { name: 'cert-manager', category: 'TLS', description: 'Automatic certificate management' },
  { name: 'NGINX Ingress', category: 'Networking', description: 'Traffic routing and load balancing' },
]

export default function HowItsBuilt() {
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.backLink}>← Back to Portfolio</Link>
      </nav>

      <header className={styles.header}>
        <h1>How This Website Is Built</h1>
        <p className={styles.subtitle}>
          A technical deep-dive into the infrastructure and CI/CD pipeline powering this portfolio
        </p>
      </header>

      <section className={styles.section}>
        <h2>Architecture Overview</h2>
        <div className={styles.diagram}>
          <pre>{`
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Developer Workflow                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ git push
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                             GitHub Actions CI/CD                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐   │
│  │   Checkout  │───▶│ Build Image │───▶│Push to DHubβ"‚───▶│Update Helm  │   │
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
│                              AWS EKS Cluster                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Kubernetes Workloads                         │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────────┐   │    │
│  │  │cert-manager │  │ingress-nginx│  │   fuhriman-website        │   │    │
│  │  │(TLS certs)  │  │(LoadBalancer)│  │   (This Website!)         │   │    │
│  │  └─────────────┘  └─────────────┘  └───────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                            https://fuhriman.org
`}</pre>
        </div>
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
│   ├── aws-vpc/           # VPC, subnets, NAT Gateway, route tables
│   ├── aws-eks/           # EKS cluster, node groups, IAM roles
│   └── helm-argocd/       # ArgoCD installation via Helm
├── main.tf                # Module composition
├── providers.tf           # AWS, Kubernetes, Helm providers
├── backend.tf             # S3 state with DynamoDB locking
└── variables.tf           # Configuration variables`}</pre>
        </div>
        <div className={styles.highlights}>
          <div className={styles.highlight}>
            <h4>VPC Module</h4>
            <p>Creates an isolated network with public and private subnets. The private subnet hosts EKS nodes while the public subnet contains the NAT Gateway for outbound internet access.</p>
          </div>
          <div className={styles.highlight}>
            <h4>EKS Module</h4>
            <p>Provisions a managed Kubernetes cluster with a node group of 2 t3.medium instances. Includes IAM roles for the cluster and nodes, plus an OIDC provider for service account authentication.</p>
          </div>
          <div className={styles.highlight}>
            <h4>ArgoCD Module</h4>
            <p>Deploys ArgoCD using the Helm provider and configures it to watch the app-of-apps repository for GitOps-based continuous deployment.</p>
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
            <p>Multi-stage Docker build compiles the Next.js app and creates an optimized production image for ARM64.</p>
          </div>
          <div className={styles.pipelineArrow}>→</div>
          <div className={styles.pipelineStep}>
            <div className={styles.pipelineIcon}>2</div>
            <h4>Push</h4>
            <p>Image is pushed to Docker Hub with a timestamp tag (ga-YYYY.MM.DD-HHMM) for versioning.</p>
          </div>
          <div className={styles.pipelineArrow}>→</div>
          <div className={styles.pipelineStep}>
            <div className={styles.pipelineIcon}>3</div>
            <h4>Update</h4>
            <p>The Helm chart's values.yaml is updated with the new image tag and committed to eks-helm-charts.</p>
          </div>
          <div className={styles.pipelineArrow}>→</div>
          <div className={styles.pipelineStep}>
            <div className={styles.pipelineIcon}>4</div>
            <h4>Deploy</h4>
            <p>ArgoCD detects the change and automatically syncs the new image to the Kubernetes cluster.</p>
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
          platforms: linux/arm64
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
              <li>2 replicas for high availability</li>
              <li>Resource limits: 100m CPU, 128Mi memory</li>
              <li>Liveness and readiness probes on port 3000</li>
              <li>Rolling update strategy</li>
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
              <li>NGINX ingress class</li>
              <li>TLS termination with cert-manager</li>
              <li>Host: fuhriman.org</li>
              <li>Let's Encrypt certificate</li>
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
            <p>Infrastructure as Code for AWS VPC, EKS cluster, and ArgoCD installation</p>
            <span className={styles.repoTag}>Terraform</span>
          </a>
          <a href="https://github.com/furryman/eks-helm-charts" target="_blank" rel="noopener noreferrer" className={styles.repoCard}>
            <h4>furryman/eks-helm-charts</h4>
            <p>Helm charts for cert-manager, ingress-nginx, and the website deployment</p>
            <span className={styles.repoTag}>Helm</span>
          </a>
          <a href="https://github.com/furryman/argocd-app-of-apps" target="_blank" rel="noopener noreferrer" className={styles.repoCard}>
            <h4>furryman/argocd-app-of-apps</h4>
            <p>Parent ArgoCD Application managing all child applications with sync waves</p>
            <span className={styles.repoTag}>ArgoCD</span>
          </a>
          <a href="https://github.com/furryman/fuhriman-website" target="_blank" rel="noopener noreferrer" className={styles.repoCard}>
            <h4>furryman/fuhriman-website</h4>
            <p>Next.js source code with Dockerfile and GitHub Actions CI/CD workflow</p>
            <span className={styles.repoTag}>Next.js</span>
          </a>
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
        </div>
      </section>

      <footer className={styles.footer}>
        <Link href="/" className="btn">Back to Portfolio</Link>
        <p>This page is part of the portfolio at fuhriman.org</p>
      </footer>
    </main>
  )
}
