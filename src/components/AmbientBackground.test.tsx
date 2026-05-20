import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import AmbientBackground from './AmbientBackground'

describe('AmbientBackground', () => {
  it('renders a canvas with aria-hidden', () => {
    const { container } = render(<AmbientBackground />)
    const canvas = container.querySelector('canvas')
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute('aria-hidden', 'true')
  })

  it('renders the mesh gradient layer with aria-hidden', () => {
    const { container } = render(<AmbientBackground />)
    const mesh = container.querySelector('[data-mesh]')
    expect(mesh).toBeInTheDocument()
    expect(mesh).toHaveAttribute('aria-hidden', 'true')
  })

  it('root element has aria-hidden', () => {
    const { container } = render(<AmbientBackground />)
    const root = container.firstElementChild as HTMLElement
    expect(root).toHaveAttribute('aria-hidden', 'true')
  })
})
