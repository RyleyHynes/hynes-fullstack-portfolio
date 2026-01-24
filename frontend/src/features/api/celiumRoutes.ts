export type ActivityType = 'Hiking' | 'TrailRunning'
export type Difficulty = 'Easy' | 'Moderate' | 'Hard' | 'Expert'
export type LoopType = 'Loop' | 'OutAndBack' | 'PointToPoint'
export type RouteStatus = 'Published' | 'Archived'

export type RouteModel = {
  id: string
  name: string
  summary: string
  description?: string | null
  activityType: ActivityType
  difficulty: Difficulty
  distanceMiles: number
  elevationGainFt: number
  elevationLossFt?: number | null
  maxElevationFt?: number | null
  minElevationFt?: number | null
  estimatedTimeMinutes?: number | null
  loopType: LoopType
  routeGeometry: string
  startLatitude: number
  startLongitude: number
  endLatitude: number
  endLongitude: number
  landscapeTypeId: string
  regionId: string
  status: RouteStatus
  createdAt?: string
  updatedAt?: string
  publishedAt?: string | null
}

export type CreateRoutePayload = Omit<
  RouteModel,
  'id' | 'createdAt' | 'updatedAt' | 'landscapeTypeId' | 'regionId' | 'routeGeometry'
>
export type UpdateRoutePayload = CreateRoutePayload

const resolveBaseUrl = () => (
  import.meta.env.VITE_CELIUM_API_URL
    ?? (import.meta.env.PROD ? '/api/celium' : 'http://localhost:5270')
)

const baseUrl = resolveBaseUrl()

const handleResponse = async <T>(response: Response) => {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed (${response.status})`)
  }
  return response.json() as Promise<T>
}

export const listRoutes = async () =>
  handleResponse<RouteModel[]>(await fetch(`${baseUrl}/routes`))

export const getRoute = async (id: string) =>
  handleResponse<RouteModel>(await fetch(`${baseUrl}/routes/${id}`))

export const createRoute = async (payload: CreateRoutePayload) =>
  handleResponse<RouteModel>(await fetch(`${baseUrl}/routes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }))

export const updateRoute = async (id: string, payload: UpdateRoutePayload) =>
  handleResponse<RouteModel>(await fetch(`${baseUrl}/routes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }))

export const deleteRoute = async (id: string) => {
  const response = await fetch(`${baseUrl}/routes/${id}`, { method: 'DELETE' })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed (${response.status})`)
  }
}
