import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ArchitectureDiagram from './ArchitectureDiagram'

describe('ArchitectureDiagram', () => {
  it('renders the developer-through-deploy node chain', () => {
    render(<ArchitectureDiagram />)
    expect(screen.getByText('Developer')).toBeInTheDocument()
    expect(screen.getByText('git push')).toBeInTheDocument()
    expect(screen.getByText(/GitHub Actions CI\/CD/i)).toBeInTheDocument()
    expect(screen.getByText('Docker Hub')).toBeInTheDocument()
    expect(screen.getByText('eks-helm-charts')).toBeInTheDocument()
    expect(screen.getByText('ArgoCD')).toBeInTheDocument()
    expect(screen.getByText(/AWS EC2 t3\.small/i)).toBeInTheDocument()
    expect(screen.getByText('fuhriman-website')).toBeInTheDocument()
    expect(screen.getByText('https://fuhriman.org')).toBeInTheDocument()
  })

  it('renders the pipeline flow steps', () => {
    render(<ArchitectureDiagram />)
    expect(screen.getByText(/Lint & Audit/i)).toBeInTheDocument()
    expect(screen.getByText('Build Image')).toBeInTheDocument()
    expect(screen.getByText('Push to Hub')).toBeInTheDocument()
    expect(screen.getByText('Trivy Scan')).toBeInTheDocument()
    expect(screen.getByText('Update Helm')).toBeInTheDocument()
  })
})
