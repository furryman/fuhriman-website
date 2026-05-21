import styles from './Footer.module.css'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.line}>
          Built with Next 16 · React 19 · Biome 2 · Deployed to k3s · Scanned by Trivy ·{' '}
          <a
            href="https://github.com/furryman/fuhriman-website"
            target="_blank"
            rel="noopener noreferrer"
          >
            View source ↗
          </a>
        </p>
        <p className={styles.copy}>©{year} Adam Fuhriman</p>
      </div>
    </footer>
  )
}
