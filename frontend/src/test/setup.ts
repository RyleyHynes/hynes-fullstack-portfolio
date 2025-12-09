import '@testing-library/jest-dom'
import { vi } from 'vitest'

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin = '0px'
  readonly thresholds = [0]
  constructor(public callback: IntersectionObserverCallback) {}
  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
  unobserve() {}
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = MockIntersectionObserver
}

if (!window.scrollTo) {
  window.scrollTo = vi.fn()
}
