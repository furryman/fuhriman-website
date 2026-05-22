'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './Navbar.module.css'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Philosophy', href: '#philosophy' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Interests', href: '#interests' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' }
    )

    const sections = document.querySelectorAll('section[id]')
    for (const section of sections) {
      observer.observe(section)
    }
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (!panelRef.current?.contains(t) && !toggleRef.current?.contains(t)) {
        setMenuOpen(false)
      }
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onMouseDown)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onMouseDown)
      document.body.style.overflow = prevOverflow
    }
  }, [menuOpen])

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.inner}>
        <a href="#top" className={styles.logo} aria-label="Back to top">
          AF
        </a>
        <ul className={styles.links}>
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`${styles.link} ${activeSection === link.href ? styles.active : ''}`}
              >
                <span className={styles.linkNumber}>0{i + 1}.</span>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a href="/how-its-built" className={styles.link}>
              How I Built This
            </a>
          </li>
          <li>
            <button
              type="button"
              className={styles.cmdkTrigger}
              aria-label="Open command palette"
              onClick={() =>
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
              }
            >
              <kbd>⌘K</kbd>
            </button>
          </li>
          <li>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.resumeBtn}
            >
              Resume
            </a>
          </li>
        </ul>

        {/* Mobile-only hamburger toggle. Hidden via CSS above 480px. */}
        <button
          ref={toggleRef}
          type="button"
          className={styles.menuToggle}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className={`${styles.menuIcon} ${menuOpen ? styles.menuIconOpen : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Mobile slide-down panel. Hidden via CSS above 480px and when !menuOpen. */}
      <div
        ref={panelRef}
        id="mobile-nav-panel"
        className={`${styles.mobilePanel} ${menuOpen ? styles.mobilePanelOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className={styles.mobileList}>
          {navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`${styles.mobileLink} ${activeSection === link.href ? styles.active : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className={styles.mobileLinkNumber}>0{i + 1}.</span>
                {link.label}
              </a>
            </li>
          ))}
          <li className={styles.mobileDivider} aria-hidden="true" />
          <li>
            <a
              href="/how-its-built"
              className={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              How I Built This
            </a>
          </li>
          <li className={styles.mobileResumeWrap}>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mobileResumeBtn}
              onClick={() => setMenuOpen(false)}
            >
              Resume ↗
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}
