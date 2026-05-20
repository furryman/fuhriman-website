import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import About from './About'

describe('About', () => {
  it('renders heading and biography paragraphs', () => {
    const { container } = render(<About />)
    expect(screen.getByRole('heading', { name: /About Me/i })).toBeInTheDocument()
    expect(screen.getByText(/My path into DevOps/i)).toBeInTheDocument()
    expect(screen.getByText(/MasterControl/i)).toBeInTheDocument()
    expect(screen.getByText(/force multipliers/i)).toBeInTheDocument()
    expect(container.querySelector('section#about')).toBeInTheDocument()
  })
})
