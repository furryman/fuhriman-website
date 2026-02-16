import styles from './Resume.module.css'
import ScrollReveal from './ScrollReveal'

export default function Resume() {
  return (
    <section className={styles.resume}>
      <ScrollReveal>
        <div className="container">
          <div className={styles.card}>
            <h3 className={styles.heading}>Want the full picture?</h3>
            <p className={styles.description}>
              Check out my resume for a complete look at my experience, certifications, and technical skills.
            </p>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.button}
            >
              Download Resume
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
