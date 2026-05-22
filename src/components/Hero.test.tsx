import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'

describe('Hero', () => {
  it('renders the name, tagline, and CTAs', () => {
    render(<Hero />)
    expect(screen.getByText('Hi, my name is')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: /Adam Fuhriman/i })).toBeInTheDocument()
    expect(screen.getByText('From code to cloud, automated.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Get in Touch/i })).toHaveAttribute('href', '#contact')
    expect(screen.getByRole('link', { name: /View My Work/i })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: /How I Built This/i })).toHaveAttribute(
      'href',
      '/how-its-built'
    )
  })

  it('renders the description text and headshot', () => {
    render(<Hero />)
    // HeroScene is lazy-loaded (ssr: false) so 3D canvas is not in the test render.
    // Assert the description text is present to confirm the Hero renders correctly.
    expect(screen.getByText(/I build the automation/i)).toBeInTheDocument()
    // Headshot should always be present (tablet+); alt text identifies the image.
    expect(screen.getByAltText('Adam Fuhriman')).toBeInTheDocument()
  })
})
