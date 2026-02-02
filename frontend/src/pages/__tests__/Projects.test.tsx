import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Projects from '@/pages/Projects'

describe('Projects page', () => {
  it('renders project cards', () => {
    render(
      <MemoryRouter>
        <Projects />
      </MemoryRouter>
    )

    expect(screen.getByText('Selected Projects')).toBeInTheDocument()
    expect(screen.getByText('Celium')).toBeInTheDocument()
  })
})
