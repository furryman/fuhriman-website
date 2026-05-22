'use client'

import { type CSSProperties, useState } from 'react'
import styles from './CollapsibleCode.module.css'

interface Props {
  header: string
  code: string
  collapsedHeight?: string
}

export default function CollapsibleCode({ header, code, collapsedHeight = '16em' }: Props) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={styles.block}>
      <div className={styles.header}>{header}</div>
      <div
        className={`${styles.preWrap} ${expanded ? '' : styles.collapsed}`}
        style={{ '--collapsed-height': collapsedHeight } as CSSProperties}
      >
        <pre className={styles.pre}>{code}</pre>
        {!expanded && <div className={styles.fade} aria-hidden="true" />}
      </div>
      <button
        type="button"
        className={styles.toggle}
        aria-expanded={expanded}
        onClick={() => setExpanded((e) => !e)}
      >
        {expanded ? 'Collapse ↑' : 'Show full snippet ↓'}
      </button>
    </div>
  )
}
