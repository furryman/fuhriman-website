import type { ReactNode } from 'react'
import {
  AWSIcon,
  CodeIcon,
  GitHubActionsIcon,
  KubernetesIcon,
  PrometheusIcon,
  TerraformIcon,
} from '@/components/Icons'
import ScrollReveal from '@/components/ScrollReveal'
import TiltCard from '@/components/TiltCard'
import styles from './Skills.module.css'

const skillCategories: { title: string; icon: ReactNode; skills: string[] }[] = [
  {
    title: 'Cloud Platforms',
    icon: <AWSIcon size={28} />,
    skills: ['AWS', 'Azure'],
  },
  {
    title: 'Container & Orchestration',
    icon: <KubernetesIcon size={28} />,
    skills: ['Kubernetes', 'Docker', 'Helm', 'ArgoCD', 'FluxCD', 'Istio'],
  },
  {
    title: 'Infrastructure as Code',
    icon: <TerraformIcon size={28} />,
    skills: ['Terraform', 'Terragrunt', 'Terramate', 'CloudFormation'],
  },
  {
    title: 'CI/CD',
    icon: <GitHubActionsIcon size={28} />,
    skills: ['GitHub Actions', 'Azure DevOps', 'Jenkins'],
  },
  {
    title: 'Monitoring & Observability',
    icon: <PrometheusIcon size={28} />,
    skills: ['Prometheus', 'Grafana', 'OpenTelemetry', 'Datadog', 'Backstage'],
  },
  {
    title: 'Languages & Scripting',
    icon: <CodeIcon size={28} />,
    skills: ['Python', 'Bash', 'Go', 'TypeScript'],
  },
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
              <TiltCard key={category.title} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{category.icon}</span>
                  <h3 className={styles.cardTitle}>{category.title}</h3>
                </div>
                <div className={styles.tags}>
                  {category.skills.map((skill) => (
                    <span key={skill} className={styles.tag}>
                      {skill}
                    </span>
                  ))}
                </div>
              </TiltCard>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
