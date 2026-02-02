import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import CeliumLayout from '@/celium/CeliumLayout'

describe('CeliumLayout', () => {
  it('renders nav and toggles theme', () => {
    document.documentElement.classList.remove('dark')
    render(
      <MemoryRouter initialEntries={['/apps/celium/explore']}>
        <Routes>
          <Route path="/apps/celium/*" element={<CeliumLayout />}>
            <Route path="explore" element={<div>Explore page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Celium')).toBeInTheDocument()
    const toggle = screen.getByLabelText('Toggle dark mode')
    fireEvent.click(toggle)
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
