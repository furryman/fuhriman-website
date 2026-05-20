'use client'

import { type MouseEvent, type ReactNode, useRef } from 'react'

interface Props {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
  target?: string
  rel?: string
  strength?: number
}

const STYLE_BASE = {
  transition: 'transform 0.2s cubic-bezier(0.3, 0.7, 0.4, 1.2)',
  display: 'inline-block',
} as const

export default function MagneticButton({
  children,
  className,
  href,
  onClick,
  target,
  rel,
  strength = 0.25,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const MAX = 12

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    /* v8 ignore next */
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * strength
    const dy = (e.clientY - cy) * strength
    const tx = Math.max(-MAX, Math.min(MAX, dx))
    const ty = Math.max(-MAX, Math.min(MAX, dy))
    el.style.transform = `translate(${tx}px, ${ty}px)`
  }

  const handleLeave = () => {
    const el = ref.current
    /* v8 ignore next */
    if (!el) return
    el.style.transform = 'translate(0px, 0px)'
  }

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={className}
        style={STYLE_BASE}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type="button"
      className={className}
      style={STYLE_BASE}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </button>
  )
}
