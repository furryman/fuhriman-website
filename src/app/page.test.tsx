import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Home from './page'

describe('Home page', () => {
  it('renders all major sections with the expected ids', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('main.portfolio')).toBeInTheDocument()
    expect(container.querySelector('section#about')).toBeInTheDocument()
    expect(container.querySelector('section#philosophy')).toBeInTheDocument()
    expect(container.querySelector('section#skills')).toBeInTheDocument()
    expect(container.querySelector('section#experience')).toBeInTheDocument()
    expect(container.querySelector('section#contact')).toBeInTheDocument()
  })

  it('renders the navbar above the portfolio main', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('nav')).toBeInTheDocument()
  })
})
