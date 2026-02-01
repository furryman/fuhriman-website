import styles from './Experience.module.css'

const experiences = [
  {
    title: 'DevOps Engineer',
    company: 'Mastercontrol',
    period: '2021 - 2025',
    highlights: [
      'Architected and deployed multi-region Kubernetes clusters on AWS EKS for over 150 microservices',
      'Implemented Atlantis, reducing Terraform wait times from minutes to seconds, enhancing productivity and accelerating development cycles',
      'Implemented GitOps workflows with ArgoCD, reducing deployment time by 70%',
      'Built comprehensive monitoring stack with Prometheus and Grafana',
      'Built PoC for Internal Developer Portal (IDP) using Backstage',
      'Led numerous optimization/refactoring projects for Terraform modules, cutting repeated code by over 50% and speeding up deployments'
    ]
  },
  {
    title: 'DevOps Engineer',
    company: 'ACD Direct',
    period: '2020 - 2021',
    highlights: [
      'Led DevOps tranformation during a period of rapid growth by automating many previously manual processes',
      'Designed and built CI/CD pipelines with Jenkins, cutting deployment times by 70%',
      'Implmeneted SSO with Azure and reduced onboarding times from hours to minutes and saved $1500/mo by identifying wasteful user lisences'
    ]
  },
  {
    title: 'IT Support Specialist',
    company: 'ACD Direct',
    period: '2018 - 2020',
    highlights: [
      'Maintained Windows servers and performed software/security updates on VMWare VMs',
      'Cut monthly software spending costs by $2000/mo by migrating organization Jira and consolidating work management tools',
      'Collaborated with development teams to improve deployment processes',
    ]
  }
]

export default function Experience() {
  return (
    <section id="experience" className={styles.experience}>
      <div className="container">
        <h2>Experience</h2>
        <div className={styles.timeline}>
          {experiences.map((exp, index) => (
            <div key={index} className={styles.item}>
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
          ))}
        </div>
      </div>
    </section>
  )
}
