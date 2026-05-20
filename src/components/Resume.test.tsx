import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Resume from './Resume'

describe('Resume', () => {
  it('renders the Resume CTA card', () => {
    render(<Resume />)
    expect(screen.getByRole('heading', { name: /Want the full picture/i })).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /Download Resume/i })
    expect(link).toHaveAttribute('href', '/resume.pdf')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
