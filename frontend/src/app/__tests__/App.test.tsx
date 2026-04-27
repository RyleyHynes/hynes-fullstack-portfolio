import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

describe('App shell', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders primary navigation links', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Celium' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Career' })).toBeInTheDocument()
  })

  it('exposes accessibility skip link', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: /skip to content/i })).toHaveAttribute('href', '#content')
  })

  it('keeps API docs outside the launched Celium app shell', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Failed to fetch')))

    render(
      <MemoryRouter initialEntries={['/apps/celium/api-docs']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Explore' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Plan' })).not.toBeInTheDocument()
    expect(await screen.findByText('Live API schema is unavailable. Showing the bundled Celium API reference.')).toBeInTheDocument()
  })
})
