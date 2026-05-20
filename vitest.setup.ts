import '@testing-library/jest-dom/vitest'
import React from 'react'
import { vi } from 'vitest'

class IntersectionObserverMock implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin: string = ''
  readonly scrollMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {}
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...rest }: { src: string; alt: string; [key: string]: unknown }) => {
    const props = { ...rest } as Record<string, unknown>
    delete props.priority
    delete props.placeholder
    delete props.blurDataURL
    delete props.loader
    delete props.fill
    delete props.quality
    delete props.sizes
    delete props.unoptimized
    return React.createElement('img', { src, alt, ...props })
  },
}))

vi.mock('next/font/google', () => ({
  DM_Serif_Display: () => ({ variable: '', className: '' }),
  Source_Sans_3: () => ({ variable: '', className: '' }),
}))
