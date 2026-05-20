'use client'

import { useEffect, useRef } from 'react'
import styles from './AmbientBackground.module.css'

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const dpr = window.devicePixelRatio || 1
    const N = 25
    const particles: { x: number; y: number; vx: number; vy: number }[] = []
    let raf = 0
    let mx = -10000
    let my = -10000

    // Capture non-null references so TypeScript can track them in nested functions
    const cvs = canvas
    const rc = ctx

    function resize() {
      const w = window.innerWidth
      const h = window.innerHeight
      cvs.width = w * dpr
      cvs.height = h * dpr
      cvs.style.width = `${w}px`
      cvs.style.height = `${h}px`
      rc.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function seed() {
      particles.length = 0
      const w = window.innerWidth
      const h = window.innerHeight
      for (let i = 0; i < N; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
        })
      }
    }

    function tick() {
      const w = window.innerWidth
      const h = window.innerHeight
      rc.clearRect(0, 0, w, h)

      for (const p of particles) {
        const dx = mx - p.x
        const dy = my - p.y
        const d = Math.hypot(dx, dy)
        if (d < 120 && d > 0.1) {
          p.vx += (dx / d) * 0.015
          p.vy += (dy / d) * 0.015
        }
        p.vx *= 0.985
        p.vy *= 0.985
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
      }

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = particles[i]
          const b = particles[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d = Math.hypot(dx, dy)
          if (d < 100) {
            rc.strokeStyle = `rgb(240 168 104 / ${(1 - d / 100) * 25}%)`
            rc.lineWidth = 0.6
            rc.beginPath()
            rc.moveTo(a.x, a.y)
            rc.lineTo(b.x, b.y)
            rc.stroke()
          }
        }
      }

      for (const p of particles) {
        rc.fillStyle = 'rgb(240 168 104 / 70%)'
        rc.beginPath()
        rc.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
        rc.fill()
      }

      raf = requestAnimationFrame(tick)
    }

    function onMouseMove(e: MouseEvent) {
      mx = e.clientX
      my = e.clientY
    }
    function onMouseLeave() {
      mx = -10000
      my = -10000
    }
    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf)
      } else {
        raf = requestAnimationFrame(tick)
      }
    }

    resize()
    seed()
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div className={styles.root} aria-hidden="true">
      <div className={styles.mesh} data-mesh aria-hidden="true">
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>
      {/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: canvas is purely decorative; aria-hidden propagates from root but is explicit here for clarity */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </div>
  )
}
