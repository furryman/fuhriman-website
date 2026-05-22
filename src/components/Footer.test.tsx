import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Footer from './Footer'

describe('Footer', () => {
  it('renders build credits line', () => {
    render(<Footer />)
    expect(screen.getByText(/Built with/i)).toBeInTheDocument()
    expect(screen.getByText(/Next 16/i)).toBeInTheDocument()
    expect(screen.getByText(/k3s/i)).toBeInTheDocument()
    expect(screen.getByText(/Trivy/i)).toBeInTheDocument()
  })

  it('has a View source link to the GitHub repo', () => {
    render(<Footer />)
    const link = screen.getByRole('link', { name: /view source/i })
    expect(link).toHaveAttribute('href', 'https://github.com/furryman/fuhriman-website')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('has a How I built this link to the technical deep-dive page', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: /how i built this/i })).toHaveAttribute(
      'href',
      '/how-its-built'
    )
  })

  it('renders the copyright with the current year', () => {
    render(<Footer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`${year}.*Adam Fuhriman`, 'i'))).toBeInTheDocument()
  })
})
