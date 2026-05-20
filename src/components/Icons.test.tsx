import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import {
  AWSIcon,
  KubernetesIcon,
  TerraformIcon,
  GitHubActionsIcon,
  PrometheusIcon,
  CodeIcon,
  GitHubIcon,
  LinkedInIcon,
  EmailIcon,
} from './Icons'

const icons = [
  ['AWSIcon', AWSIcon],
  ['KubernetesIcon', KubernetesIcon],
  ['TerraformIcon', TerraformIcon],
  ['GitHubActionsIcon', GitHubActionsIcon],
  ['PrometheusIcon', PrometheusIcon],
  ['CodeIcon', CodeIcon],
  ['GitHubIcon', GitHubIcon],
  ['LinkedInIcon', LinkedInIcon],
  ['EmailIcon', EmailIcon],
] as const

describe('Icons', () => {
  it.each(icons)('%s renders an <svg> element', (_name, Icon) => {
    const { container } = render(<Icon />)
    const svg = container.querySelector('svg')
    expect(svg).not.toBeNull()
    expect(svg).toHaveAttribute('width', '24')
    expect(svg).toHaveAttribute('height', '24')
  })

  it('respects the size prop', () => {
    const { container } = render(<AWSIcon size={48} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '48')
    expect(svg).toHaveAttribute('height', '48')
  })

  it('applies a custom className', () => {
    const { container } = render(<EmailIcon className="custom-icon" />)
    expect(container.querySelector('svg')).toHaveClass('custom-icon')
  })
})
