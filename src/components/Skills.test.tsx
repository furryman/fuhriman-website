import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Skills from './Skills'

describe('Skills', () => {
  it('renders the heading and all skill categories', () => {
    render(<Skills />)
    expect(screen.getByRole('heading', { name: /Skills & Technologies/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cloud Platforms' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Container & Orchestration' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Infrastructure as Code' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'CI/CD' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Monitoring & Observability' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Languages & Scripting' })).toBeInTheDocument()
  })

  it('renders the recently-added skill labels', () => {
    render(<Skills />)
    expect(screen.getByText('Azure')).toBeInTheDocument()
    expect(screen.getByText('Istio')).toBeInTheDocument()
    expect(screen.getByText('OpenTelemetry')).toBeInTheDocument()
    expect(screen.getByText('Terramate')).toBeInTheDocument()
    expect(screen.getByText('Azure DevOps')).toBeInTheDocument()
  })

  it('renders a representative sample of other skills', () => {
    render(<Skills />)
    expect(screen.getByText('AWS')).toBeInTheDocument()
    expect(screen.getByText('Kubernetes')).toBeInTheDocument()
    expect(screen.getByText('Terraform')).toBeInTheDocument()
    expect(screen.getByText('GitHub Actions')).toBeInTheDocument()
    expect(screen.getByText('Prometheus')).toBeInTheDocument()
    expect(screen.getByText('Python')).toBeInTheDocument()
  })
})
