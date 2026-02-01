import styles from './Experience.module.css'

const experiences = [
  {
    title: 'DevOps Engineer',
    company: 'Mastercontrol',
    period: '2021 - 2025',
    highlights: [
      'Architected and deployed multi-region Kubernetes clusters on AWS EKS serving 10M+ requests/day',
      'Implemented GitOps workflows with ArgoCD, reducing deployment time by 70%',
      'Built comprehensive monitoring stack with Prometheus and Grafana',
      'Led migration from monolithic to microservices architecture'
    ]
  },
  {
    title: 'DevOps Engineer',
    company: 'ACD Direct',
    period: '2020 - 2021',
    highlights: [
      'Designed and maintained CI/CD pipelines using GitHub Actions',
      'Managed infrastructure as code with Terraform across multiple environments',
      'Implemented container orchestration strategy with Docker and Kubernetes',
      'Reduced infrastructure costs by 40% through optimization and automation'
    ]
  },
  {
    title: 'IT Support Specialist',
    company: 'ACD Direct',
    period: '2018 - 2020',
    highlights: [
      'Maintained Linux servers and automated routine tasks with Ansible',
      'Implemented backup and disaster recovery solutions',
      'Collaborated with development teams to improve deployment processes',
      'Transitioned legacy applications to containerized deployments'
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
