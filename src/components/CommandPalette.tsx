'use client'

import { Command } from 'cmdk'
import { useEffect, useState } from 'react'
import styles from './CommandPalette.module.css'

const GITHUB_URL = 'https://github.com/furryman'
const LINKEDIN_URL = 'https://www.linkedin.com/in/adamfuhriman/'
const EMAIL = 'adamdfuhriman@gmail.com'

export default function CommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const run = (action: () => void) => {
    action()
    setOpen(false)
  }

  const go = (id: string) => () => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const copyEmail = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(EMAIL)
    }
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Command palette"
      className={styles.dialog}
      contentClassName={styles.content}
      overlayClassName={styles.overlay}
    >
      <Command.Input placeholder="Type a command or search…" className={styles.input} />
      <Command.List className={styles.list}>
        <Command.Empty className={styles.empty}>No results.</Command.Empty>
        <Command.Group heading="Jump to" className={styles.group}>
          <Command.Item onSelect={() => run(go('about'))}>About</Command.Item>
          <Command.Item onSelect={() => run(go('philosophy'))}>Philosophy</Command.Item>
          <Command.Item onSelect={() => run(go('skills'))}>Skills</Command.Item>
          <Command.Item onSelect={() => run(go('experience'))}>Experience</Command.Item>
          <Command.Item onSelect={() => run(go('contact'))}>Contact</Command.Item>
        </Command.Group>
        <Command.Group heading="Actions" className={styles.group}>
          <Command.Item onSelect={() => run(() => window.open('/resume.pdf', '_blank'))}>
            Open Resume (PDF)
          </Command.Item>
          <Command.Item onSelect={() => run(() => (window.location.href = '/how-its-built'))}>
            View How It&apos;s Built
          </Command.Item>
          <Command.Item onSelect={() => run(copyEmail)}>Copy email to clipboard</Command.Item>
          <Command.Item onSelect={() => run(() => window.open(GITHUB_URL, '_blank'))}>
            View GitHub
          </Command.Item>
          <Command.Item onSelect={() => run(() => window.open(LINKEDIN_URL, '_blank'))}>
            View LinkedIn
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  )
}
