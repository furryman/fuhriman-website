import ScrollReveal from '@/components/ScrollReveal'
import { EmailIcon, GitHubIcon, LinkedInIcon } from '@/components/Icons'
import styles from './Contact.module.css'

export default function Contact() {
  return (
    <section id="contact" className={styles.contact}>
      <div className="container">
        <ScrollReveal>
          <h2>Get in Touch</h2>
          <p className={styles.intro}>
            I&apos;m always open to discussing new opportunities, interesting projects,
            or just chatting about DevOps and cloud technologies.
          </p>
          <div className={styles.links}>
            <a href="mailto:adamdfuhriman@gmail.com" className={styles.link}>
              <EmailIcon size={20} className={styles.icon} />
              <span>adamdfuhriman@gmail.com</span>
            </a>
            <a href="https://github.com/furryman" target="_blank" rel="noopener noreferrer" className={styles.link}>
              <GitHubIcon size={20} className={styles.icon} />
              <span>github.com/furryman</span>
            </a>
            <a href="https://linkedin.com/in/adam-fuhriman" target="_blank" rel="noopener noreferrer" className={styles.link}>
              <LinkedInIcon size={20} className={styles.icon} />
              <span>linkedin.com/in/adam-fuhriman</span>
            </a>
          </div>
          <footer className={styles.footer}>
            <p>
              Built with Next.js, deployed on Kubernetes with ArgoCD.{' '}
              <a href="/how-its-built">How I built this →</a>
            </p>
          </footer>
        </ScrollReveal>
      </div>
    </section>
  )
}
