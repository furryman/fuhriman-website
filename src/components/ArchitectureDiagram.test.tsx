import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ArchitectureDiagram from './ArchitectureDiagram'

describe('ArchitectureDiagram', () => {
  it('renders the developer-through-deploy node chain', () => {
    render(<ArchitectureDiagram />)
    expect(screen.getByText('Developer')).toBeInTheDocument()
    expect(screen.getAllByText('git push').length).toBeGreaterThan(0)
    expect(screen.getByText(/GitHub Actions CI\/CD/i)).toBeInTheDocument()
    expect(screen.getByText('Docker Hub')).toBeInTheDocument()
    expect(screen.getByText('argocd-app-of-apps')).toBeInTheDocument()
    expect(screen.getByText('eks-helm-charts')).toBeInTheDocument()
    expect(screen.getByText('ArgoCD')).toBeInTheDocument()
    expect(screen.getByText(/AWS EC2 t4g\.medium/i)).toBeInTheDocument()
    expect(screen.getByText('envoy-gateway')).toBeInTheDocument()
    expect(screen.getByText('external-dns')).toBeInTheDocument()
    expect(screen.getByText('fuhriman-website')).toBeInTheDocument()
    expect(screen.getByText('https://fuhriman.org')).toBeInTheDocument()
  })

  it('renders the request path through the Gateway', () => {
    render(<ArchitectureDiagram />)
    expect(screen.getByText(/Envoy Gateway.*public/i)).toBeInTheDocument()
    expect(screen.getByText('HTTPRoute fuhriman-website')).toBeInTheDocument()
    expect(screen.getByText('HTTPRoute argocd-server')).toBeInTheDocument()
    // Request flow bar: Visitor → Route53 → EIP → Gateway → HTTPRoute, in logical order
    expect(screen.getByText(/Visitor.*Route53.*EIP.*Envoy Gateway.*HTTPRoute/i)).toBeInTheDocument()
  })

  it('surfaces the SSM-only admin path', () => {
    render(<ArchitectureDiagram />)
    expect(screen.getByText(/AWS SSM Session Manager/i)).toBeInTheDocument()
    expect(screen.getByText(/no SSH, no public k8s API/i)).toBeInTheDocument()
  })

  it('renders both CI pipeline flows (website + AMI)', () => {
    render(<ArchitectureDiagram />)
    // build-deploy.yml steps
    expect(screen.getByText(/Lint & Audit/i)).toBeInTheDocument()
    expect(screen.getByText('Build Image')).toBeInTheDocument()
    expect(screen.getByText('Push to Hub')).toBeInTheDocument()
    expect(screen.getByText('Trivy Scan')).toBeInTheDocument()
    expect(screen.getByText('Update Helm')).toBeInTheDocument()
    // build-ami.yml steps
    expect(screen.getByText('Packer Build')).toBeInTheDocument()
    expect(screen.getByText('Tag AMI')).toBeInTheDocument()
    expect(screen.getByText('Retain 3')).toBeInTheDocument()
  })
})
