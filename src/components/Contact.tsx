import styles from './Contact.module.css'

export default function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <h2>Get in Touch</h2>
        <p className={styles.intro}>
          I'm always open to discussing new opportunities, interesting projects,
          or just chatting about DevOps and cloud technologies.
        </p>
        <div className={styles.links}>
          <a href="mailto:adamdfuhriman@gmail.com" className={styles.link}>
            <span className={styles.icon}>@</span>
            <span>adamdfuhriman@gmail.com</span>
          </a>
          <a href="https://github.com/furryman" target="_blank" rel="noopener noreferrer" className={styles.link}>
            <span className={styles.icon}>GH</span>
            <span>github.com/furryman</span>
          </a>
          <a href="https://linkedin.com/in/adam-fuhriman" target="_blank" rel="noopener noreferrer" className={styles.link}>
            <span className={styles.icon}>in</span>
            <span>linkedin.com/in/adam-fuhriman</span>
          </a>
        </div>
        <footer className={styles.footer}>
          <p>
            Built with Next.js, deployed on Kubernetes with ArgoCD.{' '}
            <a href="/how-its-built">See how it's built →</a>
          </p>
        </footer>
      </div>
    </section>
  )
}
