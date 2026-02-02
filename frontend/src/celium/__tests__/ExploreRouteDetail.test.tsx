import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ExploreRouteDetail from '@/celium/ExploreRouteDetail'

const mockRoute = {
  id: 'route-1',
  name: 'Alpine Loop',
  summary: 'Loop summary',
  description: 'Detailed description.',
  activityType: 'Hiking',
  climbingStyle: null,
  climbingGrade: null,
  difficulty: 'Easy',
  distanceMiles: 4,
  elevationGainFt: 500,
  elevationLossFt: null,
  maxElevationFt: null,
  minElevationFt: null,
  estimatedTimeMinutes: null,
  loopType: 'Loop',
  routeGeometry: '',
  startLatitude: 46.7,
  startLongitude: -121.7,
  endLatitude: 46.7,
  endLongitude: -121.7,
  landscapeTypeId: 'land',
  regionId: 'region',
  status: 'Published',
  progress: 'Todo',
  publishedAt: null,
}

vi.mock('@/features/api/celiumRoutes', () => ({
  getRoute: vi.fn(() => Promise.resolve(mockRoute)),
  updateRoute: vi.fn(() => Promise.resolve(mockRoute)),
  deleteRoute: vi.fn(() => Promise.resolve()),
}))

describe('ExploreRouteDetail', () => {
  it('loads route details and submits updates', async () => {
    const { updateRoute } = await import('@/features/api/celiumRoutes')
    render(
      <MemoryRouter initialEntries={['/apps/celium/explore/routes/route-1']}>
        <Routes>
          <Route path="/apps/celium/explore/routes/:routeId" element={<ExploreRouteDetail />} />
        </Routes>
      </MemoryRouter>
    )

    expect(await screen.findByText('Alpine Loop')).toBeInTheDocument()
    const nameInput = screen.getByDisplayValue('Alpine Loop')
    fireEvent.change(nameInput, { target: { value: 'Alpine Ridge' } })
    fireEvent.submit(screen.getByText('Update route').closest('form') as HTMLFormElement)

    await waitFor(() => {
      expect(updateRoute).toHaveBeenCalled()
    })
  })
})
