import ScrollReveal from '@/components/ScrollReveal'
import styles from './Experience.module.css'

const experiences = [
  {
    title: 'DevOps Engineer',
    company: 'Mastercontrol',
    period: '2021 - 2025',
    highlights: [
      'Managed and deployed multi-region Kubernetes clusters on AWS EKS for over 150 microservices',
      'Implemented Atlantis for Terraform automation, reducing Terraform wait times from minutes to seconds, enhancing productivity, and accelerating development cycles',
      'Coordinated GitOps workflows with ArgoCD and Helm, reducing deployment time by 70%, facilitating streamlined deployment, scaling, and management within dynamic containerized environments.',
      'Managed and maintained CI/CD pipelines and version control systems in Github Actions, which cut lead times from a monthly cadence to weekly releases',
      'Managed a comprehensive monitoring stack with Prometheus and Grafana',
      'Built a PoC for an Internal Developer Portal (IDP) using Backstage',
      'Led numerous optimization/refactoring projects for Terraform modules, simplifying the codebase, and cutting repeated code by over 50%'
    ]
  },
  {
    title: 'DevOps Engineer',
    company: 'ACD Direct',
    period: '2020 - 2021',
    highlights: [
      'Led DevOps tranformation during a period of rapid growth by automating many previously manual processes',
      'Designed and built CI/CD pipelines with Jenkins, cutting deployment times by 70%',
      'Implemented SSO with Azure and reduced onboarding times by several hours and saved $1500/mo by identifying wasteful user licenses'
    ]
  },
  {
    title: 'IT Support Specialist',
    company: 'ACD Direct',
    period: '2018 - 2020',
    highlights: [
      'Maintained Windows servers and performed software/security updates on VMWare VMs',
      'Cut monthly software spending costs by $2000 by migrating the organization to Jira and consolidating work management tools',
      'Coordinated with dev teams for performing bi-weekly roll-outs to production'
    ]
  }
]

export default function Experience() {
  return (
    <section id="experience" className={styles.experience}>
      <div className="container">
        <ScrollReveal>
          <h2>Experience</h2>
        </ScrollReveal>
        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <ScrollReveal key={index}>
              <div className={styles.item}>
                <div className={styles.header}>
                  <div>
                    <h3 className={styles.title}>{exp.title}</h3>
                    <p className={styles.company}>{exp.company}</p>
                  </div>
                  <span className={styles.period}>{exp.period}</span>
                </div>
                <ul className={styles.highlights}>
                  {exp.highlights.map((highlight, i) => (
                    <li key={i}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
