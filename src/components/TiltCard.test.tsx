import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import TiltCard from './TiltCard'

describe('TiltCard', () => {
  const originalMM = window.matchMedia
  afterEach(() => {
    window.matchMedia = originalMM
  })

  it('renders children', () => {
    render(
      <TiltCard>
        <span>inner</span>
      </TiltCard>
    )
    expect(screen.getByText('inner')).toBeInTheDocument()
  })

  it('applies a perspective transform on mousemove', () => {
    const { container } = render(
      <TiltCard>
        <span>inner</span>
      </TiltCard>
    )
    const card = container.firstElementChild as HTMLElement
    fireEvent.mouseMove(card, { clientX: 100, clientY: 100 })
    expect(card.style.transform).toMatch(/rotateX/)
    expect(card.style.transform).toMatch(/rotateY/)
  })

  it('resets transform on mouseleave', () => {
    const { container } = render(
      <TiltCard>
        <span>inner</span>
      </TiltCard>
    )
    const card = container.firstElementChild as HTMLElement
    fireEvent.mouseMove(card, { clientX: 100, clientY: 100 })
    fireEvent.mouseLeave(card)
    expect(card.style.transform).toMatch(/rotateX\(0deg\) rotateY\(0deg\)/)
  })

  it('does not apply transform when prefers-reduced-motion is set', () => {
    window.matchMedia = ((q: string) => ({
      matches: q.includes('reduce'),
      media: q,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    })) as typeof window.matchMedia

    const { container } = render(
      <TiltCard>
        <span>inner</span>
      </TiltCard>
    )
    const card = container.firstElementChild as HTMLElement
    fireEvent.mouseMove(card, { clientX: 100, clientY: 100 })
    expect(card.style.transform).toBe('')
  })

  it('applies custom className', () => {
    const { container } = render(
      <TiltCard className="my-card">
        <span>inner</span>
      </TiltCard>
    )
    const card = container.firstElementChild as HTMLElement
    expect(card.className).toContain('my-card')
  })

  it('sets willChange on mouseenter', () => {
    const { container } = render(
      <TiltCard>
        <span>inner</span>
      </TiltCard>
    )
    const card = container.firstElementChild as HTMLElement
    fireEvent.mouseEnter(card)
    expect(card.style.willChange).toBe('transform')
  })

  it('resets willChange on mouseleave', () => {
    const { container } = render(
      <TiltCard>
        <span>inner</span>
      </TiltCard>
    )
    const card = container.firstElementChild as HTMLElement
    fireEvent.mouseEnter(card)
    expect(card.style.willChange).toBe('transform')
    fireEvent.mouseLeave(card)
    expect(card.style.willChange).toBe('')
  })

  it('does not set willChange on mouseenter when prefers-reduced-motion is set', () => {
    window.matchMedia = ((q: string) => ({
      matches: q.includes('reduce'),
      media: q,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    })) as typeof window.matchMedia

    const { container } = render(
      <TiltCard>
        <span>inner</span>
      </TiltCard>
    )
    const card = container.firstElementChild as HTMLElement
    fireEvent.mouseEnter(card)
    expect(card.style.willChange).toBe('')
  })
})
