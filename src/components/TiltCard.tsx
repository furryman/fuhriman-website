'use client'

import { type MouseEvent, type ReactNode, useRef } from 'react'

interface Props {
  children: ReactNode
  className?: string
  maxAngle?: number
}

export default function TiltCard({ children, className, maxAngle = 4 }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    /* v8 ignore next */
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    const rx = -py * maxAngle
    const ry = px * maxAngle
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`
  }

  const handleLeave = () => {
    const el = ref.current
    /* v8 ignore next */
    if (!el) return
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
    el.style.willChange = ''
  }

  const handleEnter = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    /* v8 ignore next */
    if (!el) return
    el.style.willChange = 'transform'
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: decorative 3D tilt wrapper — mouse events drive a pure visual effect with no semantic interaction
    <div
      ref={ref}
      className={className}
      style={{
        transition: 'transform 0.3s ease-out',
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
    </div>
  )
}
