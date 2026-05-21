import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CommandPalette from './CommandPalette'

describe('CommandPalette', () => {
  it('is hidden by default', () => {
    render(<CommandPalette />)
    expect(screen.queryByPlaceholderText(/type a command/i)).not.toBeInTheDocument()
  })

  it('opens on Cmd+K', async () => {
    render(<CommandPalette />)
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(await screen.findByPlaceholderText(/type a command/i)).toBeInTheDocument()
  })

  it('opens on Ctrl+K', async () => {
    render(<CommandPalette />)
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true })
    expect(await screen.findByPlaceholderText(/type a command/i)).toBeInTheDocument()
  })

  it('toggles closed on second Cmd+K', async () => {
    render(<CommandPalette />)
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(await screen.findByPlaceholderText(/type a command/i)).toBeInTheDocument()
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(screen.queryByPlaceholderText(/type a command/i)).not.toBeInTheDocument()
  })

  it('filters commands as the user types', async () => {
    const user = userEvent.setup()
    render(<CommandPalette />)
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    const input = await screen.findByPlaceholderText(/type a command/i)
    await user.type(input, 'resume')
    expect(screen.getByText(/open resume/i)).toBeInTheDocument()
  })

  it('exposes Jump-to and Actions groups', async () => {
    render(<CommandPalette />)
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(await screen.findByText(/jump to/i)).toBeInTheDocument()
    expect(screen.getByText(/actions/i)).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
    expect(screen.getByText('Skills')).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  describe('action items', () => {
    let openSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    })

    afterEach(() => {
      openSpy.mockRestore()
    })

    it('selects About scroll item and closes palette', async () => {
      const scrollMock = vi.fn()
      document.body.innerHTML = '<section id="about"></section>'
      const aboutEl = document.getElementById('about')!
      aboutEl.scrollIntoView = scrollMock

      render(<CommandPalette />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      const aboutItem = await screen.findByText('About')
      fireEvent.click(aboutItem)
      expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' })
      expect(screen.queryByPlaceholderText(/type a command/i)).not.toBeInTheDocument()
    })

    it('selects Philosophy scroll item', async () => {
      const scrollMock = vi.fn()
      document.body.innerHTML = '<section id="philosophy"></section>'
      const el = document.getElementById('philosophy')!
      el.scrollIntoView = scrollMock

      render(<CommandPalette />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      const item = await screen.findByText('Philosophy')
      fireEvent.click(item)
      expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' })
    })

    it('selects Skills scroll item', async () => {
      const scrollMock = vi.fn()
      document.body.innerHTML = '<section id="skills"></section>'
      const el = document.getElementById('skills')!
      el.scrollIntoView = scrollMock

      render(<CommandPalette />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      const item = await screen.findByText('Skills')
      fireEvent.click(item)
      expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' })
    })

    it('selects Experience scroll item', async () => {
      const scrollMock = vi.fn()
      document.body.innerHTML = '<section id="experience"></section>'
      const el = document.getElementById('experience')!
      el.scrollIntoView = scrollMock

      render(<CommandPalette />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      const item = await screen.findByText('Experience')
      fireEvent.click(item)
      expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' })
    })

    it('selects Contact scroll item', async () => {
      const scrollMock = vi.fn()
      document.body.innerHTML = '<section id="contact"></section>'
      const el = document.getElementById('contact')!
      el.scrollIntoView = scrollMock

      render(<CommandPalette />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      const item = await screen.findByText('Contact')
      fireEvent.click(item)
      expect(scrollMock).toHaveBeenCalledWith({ behavior: 'smooth' })
    })

    it('opens resume PDF in new tab', async () => {
      render(<CommandPalette />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      const item = await screen.findByText(/open resume/i)
      fireEvent.click(item)
      expect(openSpy).toHaveBeenCalledWith('/resume.pdf', '_blank')
    })

    it('navigates to how-its-built page', async () => {
      render(<CommandPalette />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      const item = await screen.findByText(/how it's built/i)
      fireEvent.click(item)
      expect(window.location.href).toContain('/how-its-built')
    })

    it('copies email to clipboard', async () => {
      const writeTextMock = vi.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: writeTextMock },
        writable: true,
        configurable: true,
      })

      render(<CommandPalette />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      const item = await screen.findByText(/copy email/i)
      fireEvent.click(item)
      expect(writeTextMock).toHaveBeenCalledWith('adamdfuhriman@gmail.com')
    })

    it('opens GitHub in new tab', async () => {
      render(<CommandPalette />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      const item = await screen.findByText(/view github/i)
      fireEvent.click(item)
      expect(openSpy).toHaveBeenCalledWith('https://github.com/furryman', '_blank')
    })

    it('opens LinkedIn in new tab', async () => {
      render(<CommandPalette />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      const item = await screen.findByText(/view linkedin/i)
      fireEvent.click(item)
      expect(openSpy).toHaveBeenCalledWith('https://www.linkedin.com/in/adamfuhriman/', '_blank')
    })

    it('does not scroll when element id does not exist', async () => {
      document.body.innerHTML = ''
      render(<CommandPalette />)
      fireEvent.keyDown(window, { key: 'k', metaKey: true })
      const aboutItem = await screen.findByText('About')
      // should not throw when element is missing
      expect(() => fireEvent.click(aboutItem)).not.toThrow()
    })
  })
})
