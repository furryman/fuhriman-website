import styles from './Skills.module.css'

const skillCategories = [
  {
    title: 'Cloud Platforms',
    skills: ['AWS', 'GCP', 'Azure']
  },
  {
    title: 'Container & Orchestration',
    skills: ['Kubernetes', 'Docker', 'Helm', 'ArgoCD']
  },
  {
    title: 'Infrastructure as Code',
    skills: ['Terraform', 'Ansible', 'CloudFormation']
  },
  {
    title: 'CI/CD',
    skills: ['GitHub Actions', 'Jenkins', 'GitLab CI', 'CircleCI']
  },
  {
    title: 'Monitoring & Observability',
    skills: ['Prometheus', 'Grafana', 'Datadog', 'ELK Stack']
  },
  {
    title: 'Languages & Scripting',
    skills: ['Python', 'Bash', 'Go', 'TypeScript']
  }
]

export default function Skills() {
  return (
    <section id="skills" className={styles.skills}>
      <div className="container">
        <h2>Skills & Technologies</h2>
        <div className={styles.grid}>
          {skillCategories.map((category) => (
            <div key={category.title} className={styles.card}>
              <h3 className={styles.cardTitle}>{category.title}</h3>
              <div className={styles.tags}>
                {category.skills.map((skill) => (
                  <span key={skill} className={styles.tag}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
