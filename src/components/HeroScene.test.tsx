import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import HeroScene from './HeroScene'

describe('HeroScene', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeroScene />)
    expect(container).toBeInTheDocument()
  })

  it('has an accessible label and role', () => {
    render(<HeroScene />)
    expect(screen.getByLabelText(/k8s cluster/i)).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
