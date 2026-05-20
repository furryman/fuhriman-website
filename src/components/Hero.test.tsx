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
    expect(screen.getByRole('link', { name: /View My Work/i })).toHaveAttribute(
      'href',
      '#experience'
    )
    expect(screen.getByRole('link', { name: /How I Built This/i })).toHaveAttribute(
      'href',
      '/how-its-built'
    )
  })

  it('renders the headshot image and location badge', () => {
    render(<Hero />)
    const img = screen.getByAltText('Adam Fuhriman')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/headshot.jpg')
    expect(screen.getByText('Salt Lake City, UT')).toBeInTheDocument()
  })
})
