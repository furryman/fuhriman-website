import styles from './About.module.css'

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <h2>About Me</h2>
        <div className={styles.content}>
          <p>
            I'm a passionate DevOps Engineer with 5 years of experience designing and
            implementing cloud infrastructure, CI/CD pipelines, and container orchestration
            solutions. I thrive on automating complex processes and enabling development
            teams to ship faster and more reliably.
          </p>
          <p>
            My expertise spans across AWS, Kubernetes, Terraform, and various monitoring
            and observability tools. I believe in infrastructure as code, GitOps practices,
            and building systems that are scalable, secure, and maintainable.
          </p>
          <p>
            When I'm not architecting cloud solutions, you can find me contributing to
            open-source projects, writing technical blog posts, or exploring the latest
            developments in the cloud-native ecosystem.
          </p>
        </div>
      </div>
    </section>
  )
}
