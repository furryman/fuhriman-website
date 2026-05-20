import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import MagneticButton from './MagneticButton'

describe('MagneticButton', () => {
  const originalMM = window.matchMedia
  afterEach(() => {
    window.matchMedia = originalMM
  })

  it('renders as an anchor when href provided', () => {
    render(<MagneticButton href="/resume.pdf">Resume</MagneticButton>)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link).toHaveAttribute('href', '/resume.pdf')
  })

  it('renders as a button when no href', () => {
    const onClick = vi.fn()
    render(<MagneticButton onClick={onClick}>Click</MagneticButton>)
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument()
  })

  it('forwards target and rel on anchor', () => {
    render(
      <MagneticButton href="https://example.com" target="_blank" rel="noopener noreferrer">
        External
      </MagneticButton>
    )
    const link = screen.getByRole('link', { name: 'External' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('forwards onClick on button', () => {
    const onClick = vi.fn()
    render(<MagneticButton onClick={onClick}>Tap</MagneticButton>)
    fireEvent.click(screen.getByRole('button', { name: 'Tap' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applies translate transform on mousemove', () => {
    const { container } = render(<MagneticButton>Test</MagneticButton>)
    const el = container.firstElementChild as HTMLElement
    fireEvent.mouseMove(el, { clientX: 10, clientY: 10 })
    expect(el.style.transform).toMatch(/translate/)
  })

  it('resets transform on mouseleave', () => {
    const { container } = render(<MagneticButton>Test</MagneticButton>)
    const el = container.firstElementChild as HTMLElement
    fireEvent.mouseMove(el, { clientX: 10, clientY: 10 })
    fireEvent.mouseLeave(el)
    expect(el.style.transform).toBe('translate(0px, 0px)')
  })

  it('does not transform under prefers-reduced-motion', () => {
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
    const { container } = render(<MagneticButton>Test</MagneticButton>)
    const el = container.firstElementChild as HTMLElement
    fireEvent.mouseMove(el, { clientX: 10, clientY: 10 })
    expect(el.style.transform).toBe('')
  })

  it('does not reset transform on mouseleave under prefers-reduced-motion', () => {
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
    const { container } = render(<MagneticButton>Test</MagneticButton>)
    const el = container.firstElementChild as HTMLElement
    // Manually set transform to verify it's not cleared on leave
    el.style.transform = 'translate(5px, 5px)'
    fireEvent.mouseLeave(el)
    expect(el.style.transform).toBe('translate(5px, 5px)')
  })

  it('passes through className', () => {
    const { container } = render(<MagneticButton className="my-btn">Test</MagneticButton>)
    const el = container.firstElementChild as HTMLElement
    expect(el.className).toContain('my-btn')
  })
})
