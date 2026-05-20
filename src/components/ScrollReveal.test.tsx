import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ScrollReveal from './ScrollReveal'

describe('ScrollReveal', () => {
  let observeSpy: ReturnType<typeof vi.fn>
  let disconnectSpy: ReturnType<typeof vi.fn>
  let unobserveSpy: ReturnType<typeof vi.fn>
  let lastCallback: IntersectionObserverCallback | undefined
  let lastInstance: IntersectionObserver | undefined

  beforeEach(() => {
    observeSpy = vi.fn()
    disconnectSpy = vi.fn()
    unobserveSpy = vi.fn()
    lastCallback = undefined
    lastInstance = undefined

    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function (this: IntersectionObserver, cb: IntersectionObserverCallback) {
        lastCallback = cb
        lastInstance = this
        this.observe = observeSpy
        this.disconnect = disconnectSpy
        this.unobserve = unobserveSpy
        return this
      })
    )
  })

  it('renders children with the reveal class by default', () => {
    render(
      <ScrollReveal>
        <span>child-content</span>
      </ScrollReveal>
    )
    const child = screen.getByText('child-content')
    expect(child).toBeInTheDocument()
    expect(child.parentElement).toHaveClass('reveal')
  })

  it('uses stagger class when stagger prop is true', () => {
    render(
      <ScrollReveal stagger>
        <span>staggered</span>
      </ScrollReveal>
    )
    const child = screen.getByText('staggered')
    expect(child.parentElement).toHaveClass('stagger')
  })

  it('merges a custom className', () => {
    render(
      <ScrollReveal className="extra">
        <span>custom</span>
      </ScrollReveal>
    )
    expect(screen.getByText('custom').parentElement).toHaveClass('reveal', 'extra')
  })

  it('observes the element on mount and disconnects on unmount', () => {
    const { unmount } = render(
      <ScrollReveal>
        <span>observed</span>
      </ScrollReveal>
    )
    expect(observeSpy).toHaveBeenCalledTimes(1)
    unmount()
    expect(disconnectSpy).toHaveBeenCalledTimes(1)
  })

  it('adds the visible class and unobserves when intersecting', () => {
    render(
      <ScrollReveal>
        <span>reveal-target</span>
      </ScrollReveal>
    )
    const el = screen.getByText('reveal-target').parentElement!
    expect(lastCallback).toBeTypeOf('function')
    lastCallback!(
      [{ isIntersecting: true, target: el } as unknown as IntersectionObserverEntry],
      lastInstance!
    )
    expect(el).toHaveClass('visible')
    expect(unobserveSpy).toHaveBeenCalledWith(el)
  })

  it('does not add visible class when not intersecting', () => {
    render(
      <ScrollReveal>
        <span>not-yet</span>
      </ScrollReveal>
    )
    const el = screen.getByText('not-yet').parentElement!
    lastCallback!(
      [{ isIntersecting: false, target: el } as unknown as IntersectionObserverEntry],
      lastInstance!
    )
    expect(el).not.toHaveClass('visible')
    expect(unobserveSpy).not.toHaveBeenCalled()
  })
})
