import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Plan from '@/celium/Plan'
import PlanTripDetail from '@/celium/PlanTripDetail'
import Shop from '@/celium/Shop'
import ShopProductDetail from '@/celium/ShopProductDetail'

vi.mock('@/features/api/celiumRoutes', () => ({
  listRoutes: vi.fn(() => Promise.resolve([
    {
      id: 'todo-1',
      name: 'Skyline Ridge Traverse',
      summary: 'Plan-ready route',
      description: null,
      activityType: 'Hiking',
      climbingStyle: null,
      climbingGrade: null,
      difficulty: 'Moderate',
      distanceMiles: 8,
      elevationGainFt: 2400,
      elevationLossFt: null,
      maxElevationFt: null,
      minElevationFt: null,
      estimatedTimeMinutes: null,
      loopType: 'OutAndBack',
      routeGeometry: '',
      startLatitude: 46.7,
      startLongitude: -121.7,
      endLatitude: 46.8,
      endLongitude: -121.8,
      landscapeTypeId: 'land',
      regionId: 'region',
      status: 'Published',
      progress: 'Todo',
    },
  ])),
}))

describe('Plan and Shop pages', () => {
  it('renders plan overview', async () => {
    render(
      <MemoryRouter>
        <Plan />
      </MemoryRouter>
    )

    expect(screen.getByText('Build a trip that stacks the odds in your favor.')).toBeInTheDocument()
    expect(screen.getByText('Start a new trip.')).toBeInTheDocument()
    expect(await screen.findByText('Skyline Ridge Traverse')).toBeInTheDocument()
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
