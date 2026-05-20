import ScrollReveal from '@/components/ScrollReveal'
import styles from './About.module.css'

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className="container">
        <ScrollReveal>
          <h2>About Me</h2>
          <div className={styles.content}>
            <p>
              My path into DevOps wasn&apos;t a straight line. I spent years in hands-on
              tech roles — from leading an install team at Best Buy to network operations
              at Prismview and T4 support at Vivint — where I learned firsthand how
              frustrating it is when processes are slow, manual, and fragile. Those
              experiences gave me an appreciation for the people behind the systems and
              a conviction that technology should make their work easier, not harder.
            </p>
            <p>
              That conviction drove me to DevOps. At ACD Direct, I led a company-wide
              transformation during a period of rapid growth, replacing entirely manual
              deployments with automated pipelines. At MasterControl, I scaled that
              mindset to a large Kubernetes platform on AWS, implementing GitOps
              workflows and codifying infrastructure with Terraform. Every improvement
              was rooted in the same idea: automate the toil so teams can focus on
              work that actually matters.
            </p>
            <p>
              Today, I believe the best DevOps engineers are force multipliers — not
              because of the tools they wield, but because of the culture they help
              build. Collaboration, trust, and continuous improvement aren&apos;t buzzwords
              to me; they&apos;re the foundation of every system I&apos;ve helped shape. I
              approach new technologies, including AI, with the same practical mindset:
              adopt what genuinely augments the team&apos;s capability, and skip the hype
              that doesn&apos;t.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
