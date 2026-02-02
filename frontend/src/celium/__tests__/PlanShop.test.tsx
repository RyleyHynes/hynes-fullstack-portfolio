import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Plan from '@/celium/Plan'
import PlanTripDetail from '@/celium/PlanTripDetail'
import Shop from '@/celium/Shop'
import ShopProductDetail from '@/celium/ShopProductDetail'

describe('Plan and Shop pages', () => {
  it('renders plan overview', () => {
    render(
      <MemoryRouter>
        <Plan />
      </MemoryRouter>
    )

    expect(screen.getByText('Build a trip that stacks the odds in your favor.')).toBeInTheDocument()
    expect(screen.getByText('Start a new trip.')).toBeInTheDocument()
  })

  it('renders plan trip detail', () => {
    render(
      <MemoryRouter initialEntries={['/apps/celium/plan/trips/oct-snowline']}>
        <Routes>
          <Route path="/apps/celium/plan/trips/:tripId" element={<PlanTripDetail />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('October Snowline Scout')).toBeInTheDocument()
    expect(screen.getByText('Trip ID: oct-snowline')).toBeInTheDocument()
  })

  it('renders shop and pagination', () => {
    render(
      <MemoryRouter>
        <Shop />
      </MemoryRouter>
    )

    expect(screen.getByText('Gear that matches your route and plan.')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Next'))
  })

  it('renders shop product detail', () => {
    render(
      <MemoryRouter initialEntries={['/apps/celium/shop/products/alpine-pack']}>
        <Routes>
          <Route path="/apps/celium/shop/products/:productId" element={<ShopProductDetail />} />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Product ID: alpine-pack')).toBeInTheDocument()
    expect(screen.getByText('Bundle price')).toBeInTheDocument()
  })
})
