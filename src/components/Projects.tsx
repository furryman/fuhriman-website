import ScrollReveal from '@/components/ScrollReveal'
import TiltCard from '@/components/TiltCard'
import styles from './Projects.module.css'

interface Project {
  name: string
  description: string
  stack: string[]
  url: string
}

const projects: Project[] = [
  {
    name: 'fuhriman-website',
    description:
      'This portfolio. Next 16 + React 19 + Biome 2, multi-stage Docker → distroless, deployed to k3s via ArgoCD.',
    stack: ['Next.js', 'React', 'Biome', 'k3s', 'ArgoCD'],
    url: 'https://github.com/furryman/fuhriman-website',
  },
  {
    name: 'eks-helm-charts',
    description:
      'Helm chart library managing every service I deploy. ArgoCD reads from this repo; bumps land here automatically from app pipelines.',
    stack: ['Helm', 'Kubernetes', 'ArgoCD', 'GitOps'],
    url: 'https://github.com/furryman/eks-helm-charts',
  },
  {
    name: 'terraform',
    description:
      'Cloud infrastructure as code — AWS networking, IAM, EKS bootstrapping, and a few side projects. Modular and opinionated.',
    stack: ['Terraform', 'AWS', 'IaC'],
    url: 'https://github.com/furryman/terraform',
  },
  {
    name: 'argocd-app-of-apps',
    description:
      'GitOps root that wires every Helm release in the cluster. Adding a new app is one PR away.',
    stack: ['ArgoCD', 'GitOps', 'Kubernetes'],
    url: 'https://github.com/furryman/argocd-app-of-apps',
  },
]

export default function Projects() {
  return (
    <section id="projects" className={styles.projects}>
      <div className="container">
        <ScrollReveal>
          <h2>Projects</h2>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.grid}>
            {projects.map((p) => (
              <TiltCard key={p.name} className={styles.card}>
                <div className={styles.inner}>
                  <h3 className={styles.name}>{p.name}</h3>
                  <p className={styles.desc}>{p.description}</p>
                  <div className={styles.tags}>
                    {p.stack.map((s) => (
                      <span key={s} className={styles.tag}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.source}
                  >
                    Source ↗
                  </a>
                </div>
              </TiltCard>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
