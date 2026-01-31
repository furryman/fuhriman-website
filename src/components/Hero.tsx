import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className="container">
        <h1 className={styles.title}>
          Hi, I'm <span className={styles.highlight}>Fuhriman</span>
        </h1>
        <p className={styles.subtitle}>DevOps Engineer</p>
        <p className={styles.description}>
          5 years of experience building scalable infrastructure, automating deployments,
          and bridging the gap between development and operations.
        </p>
        <div className={styles.cta}>
          <a href="#contact" className="btn">Get in Touch</a>
          <a href="#experience" className={styles.secondary}>View My Work</a>
        </div>
      </div>
    </section>
  )
}
