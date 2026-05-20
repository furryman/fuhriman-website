import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Experience from './Experience'

describe('Experience', () => {
  it('renders the heading and all three roles', () => {
    const { container } = render(<Experience />)
    expect(screen.getByRole('heading', { name: 'Experience', level: 2 })).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { name: 'DevOps Engineer' })).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'IT Support Specialist' })).toBeInTheDocument()
    expect(screen.getByText('Mastercontrol')).toBeInTheDocument()
    expect(screen.getAllByText('ACD Direct')).toHaveLength(2)
    expect(screen.getByText('2021 - 2025')).toBeInTheDocument()
    expect(container.querySelector('section#experience')).toBeInTheDocument()
  })

  it('renders highlight bullets for each role', () => {
    render(<Experience />)
    expect(screen.getByText(/multi-region Kubernetes clusters on AWS EKS/i)).toBeInTheDocument()
    expect(screen.getByText(/Jenkins/i)).toBeInTheDocument()
    expect(screen.getByText(/Maintained Windows servers/i)).toBeInTheDocument()
  })
})
