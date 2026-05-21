import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Projects from './Projects'

describe('Projects', () => {
  it('renders the section heading', () => {
    render(<Projects />)
    expect(screen.getByRole('heading', { name: 'Projects', level: 2 })).toBeInTheDocument()
  })

  it('renders all 4 project cards by name', () => {
    render(<Projects />)
    expect(screen.getByText('fuhriman-website')).toBeInTheDocument()
    expect(screen.getByText('eks-helm-charts')).toBeInTheDocument()
    expect(screen.getByText('terraform')).toBeInTheDocument()
    expect(screen.getByText('argocd-app-of-apps')).toBeInTheDocument()
  })

  it('each card has a source link to a github.com/furryman repo', () => {
    render(<Projects />)
    const links = screen.getAllByRole('link', { name: /source/i })
    expect(links).toHaveLength(4)
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/^https:\/\/github\.com\/furryman\//)
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    }
  })

  it('renders tech tags', () => {
    render(<Projects />)
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('Helm')).toBeInTheDocument()
    expect(screen.getByText('Terraform')).toBeInTheDocument()
    expect(screen.getAllByText('ArgoCD').length).toBeGreaterThan(0)
  })
})
