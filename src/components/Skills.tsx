import { ReactNode } from 'react'
import ScrollReveal from '@/components/ScrollReveal'
import { AWSIcon, KubernetesIcon, TerraformIcon, GitHubActionsIcon, PrometheusIcon, CodeIcon } from '@/components/Icons'
import styles from './Skills.module.css'

const skillCategories: { title: string; icon: ReactNode; skills: string[] }[] = [
  {
    title: 'Cloud Platforms',
    icon: <AWSIcon size={28} />,
    skills: ['AWS']
  },
  {
    title: 'Container & Orchestration',
    icon: <KubernetesIcon size={28} />,
    skills: ['Kubernetes', 'Docker', 'Helm', 'ArgoCD', 'FluxCD']
  },
  {
    title: 'Infrastructure as Code',
    icon: <TerraformIcon size={28} />,
    skills: ['Terraform', 'Terragrunt', 'CloudFormation']
  },
  {
    title: 'CI/CD',
    icon: <GitHubActionsIcon size={28} />,
    skills: ['GitHub Actions', 'Jenkins']
  },
  {
    title: 'Monitoring & Observability',
    icon: <PrometheusIcon size={28} />,
    skills: ['Prometheus', 'Grafana', 'Datadog', 'Backstage']
  },
  {
    title: 'Languages & Scripting',
    icon: <CodeIcon size={28} />,
    skills: ['Python', 'Bash', 'Go', 'TypeScript']
  }
]

export default function Skills() {
  return (
    <section id="skills" className={styles.skills}>
      <div className="container">
        <ScrollReveal>
          <h2>Skills & Technologies</h2>
        </ScrollReveal>
        <ScrollReveal stagger>
          <div className={styles.grid}>
            {skillCategories.map((category) => (
              <div key={category.title} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{category.icon}</span>
                  <h3 className={styles.cardTitle}>{category.title}</h3>
                </div>
                <div className={styles.tags}>
                  {category.skills.map((skill) => (
                    <span key={skill} className={styles.tag}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
