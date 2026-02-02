import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Explore from '@/celium/Explore'

const mockRoutes = [
  {
    id: 'route-1',
    name: 'Disappointment Cleaver',
    summary: 'Classic line.',
    description: null,
    activityType: 'Hiking',
    climbingStyle: null,
    climbingGrade: null,
    difficulty: 'Moderate',
    distanceMiles: 8,
    elevationGainFt: 3000,
    elevationLossFt: null,
    maxElevationFt: null,
    minElevationFt: null,
    estimatedTimeMinutes: null,
    loopType: 'OutAndBack',
    routeGeometry: '',
    startLatitude: 46.7,
    startLongitude: -121.7,
    endLatitude: 46.7,
    endLongitude: -121.7,
    landscapeTypeId: 'land',
    regionId: 'region',
    status: 'Published',
    progress: 'Todo',
  },
]

vi.mock('@/features/api/celiumRoutes', () => ({
  createRoute: vi.fn(),
  deleteRoute: vi.fn(),
  listRoutes: vi.fn(() => Promise.resolve(mockRoutes)),
  updateRoute: vi.fn(),
}))

vi.mock('@/components/media/RouteMap', () => ({
  default: () => <div data-testid="route-map" />,
}))

describe('Explore', () => {
  beforeEach(() => {
    Object.defineProperty(global.navigator, 'geolocation', {
      value: {
        getCurrentPosition: (success: (pos: GeolocationPosition) => void) =>
          success({
            coords: { latitude: 46.7, longitude: -121.7 } as GeolocationCoordinates,
          } as GeolocationPosition),
      },
      configurable: true,
    })
  })

  it('renders routes from the API', async () => {
    render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    )

    expect(await screen.findByText('Disappointment Cleaver')).toBeInTheDocument()
    expect(screen.getByTestId('route-map')).toBeInTheDocument()
  })

  it('creates a new route from the modal', async () => {
    const { createRoute } = await import('@/features/api/celiumRoutes')
    render(
      <MemoryRouter>
        <Explore />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('Create route'))
    fireEvent.change(screen.getByLabelText('Name *'), { target: { value: 'Skyline Ridge' } })
    fireEvent.change(screen.getByLabelText('Distance (miles) *'), { target: { value: '6.2' } })
    fireEvent.change(screen.getByLabelText('Elevation gain (ft) *'), { target: { value: '1800' } })
    fireEvent.change(screen.getByLabelText('Activity type *'), { target: { value: 'Hiking' } })
    fireEvent.change(screen.getByLabelText('Difficulty *'), { target: { value: 'Easy' } })
    fireEvent.change(screen.getByLabelText('Loop type *'), { target: { value: 'Loop' } })
    fireEvent.change(screen.getByLabelText('Status *'), { target: { value: 'Published' } })
    fireEvent.change(screen.getByLabelText('Start latitude *'), { target: { value: '46.7N' } })
    fireEvent.change(screen.getByLabelText('Start longitude *'), { target: { value: '121.7W' } })
    fireEvent.change(screen.getByLabelText('End latitude *'), { target: { value: '46.7N' } })
    fireEvent.change(screen.getByLabelText('End longitude *'), { target: { value: '121.7W' } })
    fireEvent.change(
      screen.getByPlaceholderText('High-alpine ridgeline with big views, strong winds, and a narrow descent. Best in stable weather windows.'),
      { target: { value: 'Great route.' } }
    )

    const submitButtons = screen.getAllByText('Create route')
    fireEvent.click(submitButtons[submitButtons.length - 1])

    await waitFor(() => {
      expect(createRoute).toHaveBeenCalled()
    })
  })
})
