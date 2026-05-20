import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HowItsBuilt from './page'

describe('How I Built This page', () => {
  it('renders the page heading and key sections', () => {
    render(<HowItsBuilt />)
    expect(screen.getByRole('heading', { name: 'How I Built This', level: 1 })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Architecture Overview', level: 2 })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Technology Stack', level: 2 })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Infrastructure as Code', level: 2 })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'CI/CD Pipeline', level: 2 })).toBeInTheDocument()
  })

  it('renders the back-to-portfolio links', () => {
    render(<HowItsBuilt />)
    const backLinks = screen.getAllByRole('link', { name: /Back to Portfolio/i })
    expect(backLinks.length).toBeGreaterThanOrEqual(1)
    backLinks.forEach((link) => expect(link).toHaveAttribute('href', '/'))
  })

  it('renders the four related repo cards', () => {
    render(<HowItsBuilt />)
    expect(screen.getByRole('heading', { name: 'furryman/terraform' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'furryman/eks-helm-charts' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'furryman/argocd-app-of-apps' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'furryman/fuhriman-website' })).toBeInTheDocument()
  })
})
