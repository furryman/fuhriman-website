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

  it('dispatches a ⌘K keydown event when the command palette trigger is clicked', () => {
    render(<Navbar />)
    const dispatched: KeyboardEvent[] = []
    const listener = (e: Event) => dispatched.push(e as KeyboardEvent)
    window.addEventListener('keydown', listener)

    const trigger = screen.getByRole('button', { name: /open command palette/i })
    fireEvent.click(trigger)

    expect(dispatched).toHaveLength(1)
    expect(dispatched[0].key).toBe('k')
    expect(dispatched[0].metaKey).toBe(true)

    window.removeEventListener('keydown', listener)
  })

  describe('mobile menu', () => {
    it('starts closed with aria-expanded=false and panel hidden', () => {
      render(<Navbar />)
      const toggle = screen.getByRole('button', { name: /open menu/i })
      expect(toggle).toHaveAttribute('aria-expanded', 'false')
      const panel = document.getElementById('mobile-nav-panel')!
      expect(panel).toHaveAttribute('aria-hidden', 'true')
    })

    it('opens when the hamburger toggle is clicked', () => {
      render(<Navbar />)
      const toggle = screen.getByRole('button', { name: /open menu/i })
      act(() => {
        fireEvent.click(toggle)
      })
      expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute(
        'aria-expanded',
        'true'
      )
      const panel = document.getElementById('mobile-nav-panel')!
      expect(panel).toHaveAttribute('aria-hidden', 'false')
    })

    it('locks body scroll while open and restores it on close', () => {
      render(<Navbar />)
      const toggle = screen.getByRole('button', { name: /open menu/i })
      document.body.style.overflow = 'auto'

      act(() => {
        fireEvent.click(toggle)
      })
      expect(document.body.style.overflow).toBe('hidden')

      act(() => {
        fireEvent.click(screen.getByRole('button', { name: /close menu/i }))
      })
      expect(document.body.style.overflow).toBe('auto')
    })

    it('closes on Escape key and returns focus to the toggle', () => {
      render(<Navbar />)
      const toggle = screen.getByRole('button', { name: /open menu/i }) as HTMLButtonElement
      act(() => {
        fireEvent.click(toggle)
      })
      act(() => {
        fireEvent.keyDown(window, { key: 'Escape' })
      })
      expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute(
        'aria-expanded',
        'false'
      )
      expect(document.activeElement).toBe(toggle)
    })

    it('ignores non-Escape keydowns while open', () => {
      render(<Navbar />)
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
      })
      act(() => {
        fireEvent.keyDown(window, { key: 'Enter' })
      })
      expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute(
        'aria-expanded',
        'true'
      )
    })

    it('closes when a mousedown lands outside both the panel and the toggle', () => {
      render(<Navbar />)
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
      })
      const outside = document.createElement('div')
      document.body.appendChild(outside)
      act(() => {
        fireEvent.mouseDown(outside)
      })
      expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute(
        'aria-expanded',
        'false'
      )
      document.body.removeChild(outside)
    })

    it('stays open when a mousedown lands inside the panel', () => {
      render(<Navbar />)
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
      })
      const panel = document.getElementById('mobile-nav-panel')!
      act(() => {
        fireEvent.mouseDown(panel)
      })
      expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute(
        'aria-expanded',
        'true'
      )
    })

    it('stays open when a mousedown lands on the toggle itself (toggle handles its own state)', () => {
      render(<Navbar />)
      const toggle = screen.getByRole('button', { name: /open menu/i })
      act(() => {
        fireEvent.click(toggle)
      })
      const closeToggle = screen.getByRole('button', { name: /close menu/i })
      act(() => {
        fireEvent.mouseDown(closeToggle)
      })
      // mousedown alone shouldn't close — click handler is what flips state
      expect(closeToggle).toHaveAttribute('aria-expanded', 'true')
    })

    it('closes when a mobile panel link is clicked', () => {
      render(<Navbar />)
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
      })
      const panel = document.getElementById('mobile-nav-panel')!
      const aboutLink = panel.querySelector('a[href="#about"]')!
      act(() => {
        fireEvent.click(aboutLink)
      })
      expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute(
        'aria-expanded',
        'false'
      )
    })

    it('closes when the mobile How I Built This link is clicked', () => {
      render(<Navbar />)
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
      })
      const panel = document.getElementById('mobile-nav-panel')!
      const link = panel.querySelector('a[href="/how-its-built"]')!
      act(() => {
        fireEvent.click(link)
      })
      expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute(
        'aria-expanded',
        'false'
      )
    })

    it('closes when the mobile Resume button is clicked', () => {
      render(<Navbar />)
      act(() => {
        fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
      })
      const panel = document.getElementById('mobile-nav-panel')!
      const link = panel.querySelector('a[href="/resume.pdf"]')!
      act(() => {
        fireEvent.click(link)
      })
      expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute(
        'aria-expanded',
        'false'
      )
    })
  })
})
