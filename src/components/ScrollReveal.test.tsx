import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ScrollReveal from './ScrollReveal'

describe('ScrollReveal', () => {
  it('renders children with the reveal class', () => {
    render(
      <ScrollReveal>
        <span>child</span>
      </ScrollReveal>
    )
    expect(screen.getByText('child').parentElement).toHaveClass('reveal')
  })

  it('adds stagger class when stagger prop is true', () => {
    render(
      <ScrollReveal stagger>
        <span>child</span>
      </ScrollReveal>
    )
    expect(screen.getByText('child').parentElement).toHaveClass('stagger')
  })

  it('merges a custom className', () => {
    render(
      <ScrollReveal className="extra">
        <span>child</span>
      </ScrollReveal>
    )
    const parent = screen.getByText('child').parentElement as HTMLElement
    expect(parent).toHaveClass('reveal')
    expect(parent).toHaveClass('extra')
  })

  it('does not add stagger class when stagger is false (default)', () => {
    render(
      <ScrollReveal>
        <span>child</span>
      </ScrollReveal>
    )
    const parent = screen.getByText('child').parentElement as HTMLElement
    expect(parent).not.toHaveClass('stagger')
  })
})
