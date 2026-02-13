import Image from 'next/image'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.heroContent}`}>
        <div className={styles.textContent}>
          <h1 className={styles.title}>
            Hi, I&apos;m <span className={styles.highlight}>Adam Fuhriman</span>
          </h1>
          <p className={styles.subtitle}>DevOps Engineer</p>
          <p className={styles.description}>
            5 years of experience building scalable infrastructure, automating deployments,
            and bridging the gap between development and operations.
          </p>
          <div className={styles.cta}>
            <a href="#contact" className="btn">Get in Touch</a>
            <a href="#experience" className={styles.secondary}>View My Work</a>
            <a href="/how-its-built" className={styles.secondary}>How It&apos;s Built</a>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className={styles.secondary}>View Resume</a>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <Image
            src="/headshot.jpg"
            alt="Adam Fuhriman"
            width={320}
            height={320}
            className={styles.headshot}
            priority
          />
        </div>
      </div>
    </section>
  )
}
