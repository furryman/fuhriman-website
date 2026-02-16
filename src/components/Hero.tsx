import Image from 'next/image'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={`container ${styles.heroContent}`}>
        <div className={styles.textColumn}>
          <p className={styles.greeting}>Hi, my name is</p>
          <h1 className={`${styles.name} gradient-text`}>Adam Fuhriman</h1>
          <h2 className={styles.tagline}>From code to cloud, automated.</h2>
          <p className={styles.description}>
            With 5 years in the DevOps space, I believe the best infrastructure is the kind
            you never have to think about. I build the automation, platforms, and observability
            that make that possible.
          </p>
          <div className={styles.cta}>
            <a href="#contact" className="btn">Get in Touch</a>
            <a href="#experience" className={styles.secondary}>View My Work</a>
            <a href="/how-its-built" className={styles.secondary}>How I Built This</a>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <Image
            src="/headshot.jpg"
            alt="Adam Fuhriman"
            width={300}
            height={300}
            className={styles.headshot}
            priority
          />
        </div>
      </div>
    </section>
  )
}
