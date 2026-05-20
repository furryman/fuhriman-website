import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Contact from './Contact'

describe('Contact', () => {
  it('renders the contact heading and intro copy', () => {
    const { container } = render(<Contact />)
    expect(screen.getByRole('heading', { name: /Get in Touch/i })).toBeInTheDocument()
    expect(screen.getByText(/always open to discussing new opportunities/i)).toBeInTheDocument()
    expect(container.querySelector('section#contact')).toBeInTheDocument()
  })

  it('exposes the email, GitHub, and LinkedIn links with correct hrefs', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: /adamdfuhriman@gmail.com/i })).toHaveAttribute(
      'href',
      'mailto:adamdfuhriman@gmail.com'
    )
    expect(screen.getByRole('link', { name: /github\.com\/furryman/i })).toHaveAttribute(
      'href',
      'https://github.com/furryman'
    )
    expect(screen.getByRole('link', { name: /linkedin\.com\/in\/adam-fuhriman/i })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/adam-fuhriman'
    )
  })

  it('renders the footer with a How I built this link', () => {
    render(<Contact />)
    expect(screen.getByRole('link', { name: /How I built this/i })).toHaveAttribute(
      'href',
      '/how-its-built'
    )
  })
})
