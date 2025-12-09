import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '../Home'
import { projects } from '@/data/profile'

describe('Home page', () => {
  it('renders hero copy and CTA buttons', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    expect(screen.getByRole('heading', { name: /Crafting dependable software/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Explore Projects/i })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  it('displays preview cards for the first three projects', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    )

    const cards = screen.getAllByRole('heading', { level: 3 })
    expect(cards).toHaveLength(Math.min(3, projects.length))
  })
})
