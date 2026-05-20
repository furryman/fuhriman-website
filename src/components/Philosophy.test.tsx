import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Philosophy from './Philosophy'

describe('Philosophy', () => {
  it('renders all three philosophy cards', () => {
    const { container } = render(<Philosophy />)
    expect(screen.getByRole('heading', { name: /Philosophy/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Culture Over Tools' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Automate Everything' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Practical AI' })).toBeInTheDocument()
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(container.querySelector('section#philosophy')).toBeInTheDocument()
  })
})
