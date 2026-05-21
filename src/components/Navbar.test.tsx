import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Navbar from './Navbar'

describe('Navbar', () => {
  let lastCallback: IntersectionObserverCallback | undefined
  let lastInstance: IntersectionObserver | undefined

  beforeEach(() => {
    lastCallback = undefined
    lastInstance = undefined
    vi.stubGlobal(
      'IntersectionObserver',
      vi.fn(function (this: IntersectionObserver, cb: IntersectionObserverCallback) {
        lastCallback = cb
        lastInstance = this
        this.observe = vi.fn()
        this.disconnect = vi.fn()
        this.unobserve = vi.fn()
        this.takeRecords = vi.fn(() => [])
        return this
      })
    )
  })

  it('renders the logo, numbered links, How I Built This, and Resume button', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /back to top/i })).toHaveAttribute('href', '#top')
    expect(screen.getByRole('link', { name: /01.*About/i })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: /02.*Philosophy/i })).toHaveAttribute(
      'href',
      '#philosophy'
    )
    expect(screen.getByRole('link', { name: /03.*Skills/i })).toHaveAttribute('href', '#skills')
    expect(screen.getByRole('link', { name: /04.*Experience/i })).toHaveAttribute(
      'href',
      '#experience'
    )
    expect(screen.getByRole('link', { name: /05.*Projects/i })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: /06.*Interests/i })).toHaveAttribute(
      'href',
      '#interests'
    )
    expect(screen.getByRole('link', { name: /07.*Contact/i })).toHaveAttribute('href', '#contact')
    expect(screen.getByRole('link', { name: 'How I Built This' })).toHaveAttribute(
      'href',
      '/how-its-built'
    )
    const resume = screen.getByRole('link', { name: 'Resume' })
    expect(resume).toHaveAttribute('href', '/resume.pdf')
    expect(resume).toHaveAttribute('target', '_blank')
    expect(resume).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('starts with no active section', () => {
    render(<Navbar />)
    const aboutLink = screen.getByRole('link', { name: /01.*About/i })
    expect(aboutLink.className).not.toMatch(/active/)
  })

  it('highlights the link for the intersecting section', () => {
    render(<Navbar />)
    const skills = document.createElement('section')
    skills.id = 'skills'
    document.body.appendChild(skills)

    act(() => {
      lastCallback!(
        [{ isIntersecting: true, target: skills } as unknown as IntersectionObserverEntry],
        lastInstance!
      )
    })

    const skillsLink = screen.getByRole('link', { name: /03.*Skills/i })
    expect(skillsLink.className).toMatch(/active/)
    document.body.removeChild(skills)
  })

  it('ignores entries that are not intersecting', () => {
    render(<Navbar />)
    const philosophy = document.createElement('section')
    philosophy.id = 'philosophy'
    document.body.appendChild(philosophy)

    act(() => {
      lastCallback!(
        [{ isIntersecting: false, target: philosophy } as unknown as IntersectionObserverEntry],
        lastInstance!
      )
    })

    const philosophyLink = screen.getByRole('link', { name: /02.*Philosophy/i })
    expect(philosophyLink.className).not.toMatch(/active/)
    document.body.removeChild(philosophy)
  })

  it('toggles the scrolled class when window scrolls past 50px', () => {
    const { container } = render(<Navbar />)
    const nav = container.querySelector('nav')!
    const initialClass = nav.className

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true, configurable: true })
      fireEvent.scroll(window)
    })

    expect(nav.className).not.toEqual(initialClass)
    expect(nav.className).toMatch(/scrolled/)

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
      fireEvent.scroll(window)
    })
    expect(nav.className).not.toMatch(/scrolled/)
  })
})
