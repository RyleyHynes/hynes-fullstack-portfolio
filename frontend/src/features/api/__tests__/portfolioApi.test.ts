import { describe, afterEach, expect, it, vi } from 'vitest'
import {
  prepareAuthHeaders,
  resolveBaseUrl,
  portfolioApi,
  loginRequest,
  meRequest,
  boardsRequest,
  createBoardRequest,
  moveCardRequest,
  generatePlanRequest,
} from '../portfolioApi'

afterEach(() => {
  vi.unstubAllEnvs()
  localStorage.clear()
})

describe('portfolioApi utilities', () => {
  it('resolves base URL based on PROD env', () => {
    vi.stubEnv('PROD', true)
    expect(resolveBaseUrl()).toBe('/api/')
    vi.stubEnv('PROD', false)
    expect(resolveBaseUrl()).toBe('http://localhost:8000/api/')
  })

  it('applies auth header when token provided', () => {
    const headers = new Headers()
    prepareAuthHeaders(headers, 'abc123')
    expect(headers.get('authorization')).toBe('Bearer abc123')
  })

  it('reads token from localStorage by default and skips when absent', () => {
    const headersWithToken = new Headers()
    localStorage.setItem('access', 'stored-token')
    prepareAuthHeaders(headersWithToken)
    expect(headersWithToken.get('authorization')).toBe('Bearer stored-token')

    const headersWithout = new Headers()
    localStorage.removeItem('access')
    prepareAuthHeaders(headersWithout)
    expect(headersWithout.get('authorization')).toBeNull()
  })

  it('exposes expected endpoints on the API slice', () => {
    expect(portfolioApi.reducerPath).toBe('portfolioApi')
    expect(portfolioApi.endpoints.login).toBeDefined()
    expect(portfolioApi.endpoints.generatePlan).toBeDefined()
  })

  it('builds request payloads for each endpoint', () => {
    expect(loginRequest({ username: 'u', password: 'p' })).toMatchObject({ url: 'auth/token/', method: 'POST' })
    expect(meRequest()).toBe('accounts/me/')
    expect(boardsRequest()).toBe('tracker/boards/')
    expect(createBoardRequest({ title: 'New' })).toMatchObject({ url: 'tracker/boards/', method: 'POST' })
    expect(moveCardRequest({ id: 1, column: 2, position: 3 })).toMatchObject({ url: 'tracker/cards/1/move/' })
    expect(generatePlanRequest({ name: 'Base', start_date: '2024-01-01', weeks: 4 })).toMatchObject({ url: 'training/plans/generate/' })
  })
})
