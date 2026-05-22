import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CollapsibleCode from './CollapsibleCode'

describe('CollapsibleCode', () => {
  it('renders the header and code content', () => {
    render(<CollapsibleCode header="example.sh" code="echo hello" />)
    expect(screen.getByText('example.sh')).toBeInTheDocument()
    expect(screen.getByText('echo hello')).toBeInTheDocument()
  })

  it('starts collapsed with aria-expanded=false and the show-full label', () => {
    render(<CollapsibleCode header="x" code="y" />)
    const toggle = screen.getByRole('button', { name: /show full snippet/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
  })

  it('expands when the toggle is clicked and switches the label', () => {
    render(<CollapsibleCode header="x" code="y" />)
    fireEvent.click(screen.getByRole('button', { name: /show full snippet/i }))
    const collapseBtn = screen.getByRole('button', { name: /collapse/i })
    expect(collapseBtn).toHaveAttribute('aria-expanded', 'true')
  })

  it('collapses again when toggled twice', () => {
    render(<CollapsibleCode header="x" code="y" />)
    const toggle = screen.getByRole('button', { name: /show full snippet/i })
    fireEvent.click(toggle)
    fireEvent.click(screen.getByRole('button', { name: /collapse/i }))
    expect(screen.getByRole('button', { name: /show full snippet/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })

  it('applies the configured collapsedHeight as a CSS variable', () => {
    const { container } = render(<CollapsibleCode header="x" code="y" collapsedHeight="20em" />)
    const wrap = container.querySelector('[style*="--collapsed-height"]') as HTMLElement
    expect(wrap.style.getPropertyValue('--collapsed-height')).toBe('20em')
  })

  it('falls back to the default collapsedHeight when not provided', () => {
    const { container } = render(<CollapsibleCode header="x" code="y" />)
    const wrap = container.querySelector('[style*="--collapsed-height"]') as HTMLElement
    expect(wrap.style.getPropertyValue('--collapsed-height')).toBe('16em')
  })

  it('hides the fade gradient when expanded', () => {
    const { container } = render(<CollapsibleCode header="x" code="y" />)
    // Fade present while collapsed
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /show full snippet/i }))
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull()
  })
})
