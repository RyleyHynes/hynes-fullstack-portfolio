import {
  listRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  getRoute,
} from '@/features/api/celiumRoutes'

const mockRoute = {
  id: 'route-1',
  name: 'Alpine',
  summary: 'Summary',
  description: null,
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
}

describe('celiumRoutes api', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('lists routes', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => [mockRoute],
    } as Response)

    const result = await listRoutes()
    expect(result[0].id).toBe('route-1')
  })

  it('gets a route', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockRoute,
    } as Response)

    const result = await getRoute('route-1')
    expect(result.name).toBe('Alpine')
  })

  it('creates a route', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockRoute,
    } as Response)

    await createRoute({
      name: mockRoute.name,
      summary: mockRoute.summary,
      description: mockRoute.description ?? null,
      activityType: mockRoute.activityType,
      climbingStyle: mockRoute.climbingStyle,
      climbingGrade: mockRoute.climbingGrade,
      difficulty: mockRoute.difficulty,
      distanceMiles: mockRoute.distanceMiles,
      elevationGainFt: mockRoute.elevationGainFt,
      elevationLossFt: mockRoute.elevationLossFt,
      maxElevationFt: mockRoute.maxElevationFt,
      minElevationFt: mockRoute.minElevationFt,
      estimatedTimeMinutes: mockRoute.estimatedTimeMinutes,
      loopType: mockRoute.loopType,
      startLatitude: mockRoute.startLatitude,
      startLongitude: mockRoute.startLongitude,
      endLatitude: mockRoute.endLatitude,
      endLongitude: mockRoute.endLongitude,
      status: mockRoute.status,
      progress: mockRoute.progress,
      publishedAt: null,
    })

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/routes'), expect.objectContaining({ method: 'POST' }))
  })

  it('updates a route', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockRoute,
    } as Response)

    await updateRoute('route-1', {
      name: mockRoute.name,
      summary: mockRoute.summary,
      description: mockRoute.description ?? null,
      activityType: mockRoute.activityType,
      climbingStyle: mockRoute.climbingStyle,
      climbingGrade: mockRoute.climbingGrade,
      difficulty: mockRoute.difficulty,
      distanceMiles: mockRoute.distanceMiles,
      elevationGainFt: mockRoute.elevationGainFt,
      elevationLossFt: mockRoute.elevationLossFt,
      maxElevationFt: mockRoute.maxElevationFt,
      minElevationFt: mockRoute.minElevationFt,
      estimatedTimeMinutes: mockRoute.estimatedTimeMinutes,
      loopType: mockRoute.loopType,
      startLatitude: mockRoute.startLatitude,
      startLongitude: mockRoute.startLongitude,
      endLatitude: mockRoute.endLatitude,
      endLongitude: mockRoute.endLongitude,
      status: mockRoute.status,
      progress: mockRoute.progress,
      publishedAt: null,
    })

    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/routes/route-1'), expect.objectContaining({ method: 'PUT' }))
  })

  it('deletes a route', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValue({
      ok: true,
      text: async () => '',
    } as Response)

    await deleteRoute('route-1')
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/routes/route-1'), { method: 'DELETE' })
  })
})
