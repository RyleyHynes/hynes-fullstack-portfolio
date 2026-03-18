export type ActivityType = 'Hiking' | 'TrailRunning' | 'RockClimbing'
export type ClimbingStyle = 'Sport' | 'Trad' | 'Bouldering' | 'Ice'
export type Difficulty = 'Easy' | 'Moderate' | 'Hard' | 'Expert'
export type LoopType = 'Loop' | 'OutAndBack' | 'PointToPoint'
export type RouteStatus = 'Published' | 'Archived'
export type RouteProgress = 'Todo' | 'Completed'

export type RouteModel = {
  id: string
  name: string
  summary: string
  description?: string | null
  activityType: ActivityType
  climbingStyle?: ClimbingStyle | null
  climbingGrade?: string | null
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
  progress: RouteProgress
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

const buildHeaders = (accessToken?: string, withJson = false) => {
  const headers: Record<string, string> = {}
  if (withJson) {
    headers['Content-Type'] = 'application/json'
  }
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }
  return headers
}

export const listRoutes = async (accessToken?: string) =>
  handleResponse<RouteModel[]>(await fetch(`${baseUrl}/routes`, {
    headers: buildHeaders(accessToken),
  }))

export const getRoute = async (id: string, accessToken?: string) =>
  handleResponse<RouteModel>(await fetch(`${baseUrl}/routes/${id}`, {
    headers: buildHeaders(accessToken),
  }))

export const createRoute = async (payload: CreateRoutePayload, accessToken?: string) =>
  handleResponse<RouteModel>(await fetch(`${baseUrl}/routes`, {
    method: 'POST',
    headers: buildHeaders(accessToken, true),
    body: JSON.stringify(payload),
  }))

export const updateRoute = async (id: string, payload: UpdateRoutePayload, accessToken?: string) =>
  handleResponse<RouteModel>(await fetch(`${baseUrl}/routes/${id}`, {
    method: 'PUT',
    headers: buildHeaders(accessToken, true),
    body: JSON.stringify(payload),
  }))

export const deleteRoute = async (id: string, accessToken?: string) => {
  const response = await fetch(`${baseUrl}/routes/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessToken),
  })
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed (${response.status})`)
  }
}
