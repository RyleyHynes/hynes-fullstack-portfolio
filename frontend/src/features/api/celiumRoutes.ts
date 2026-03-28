import { ApiError, apiRequest } from '@/features/api/apiClient'

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

type BaseRoutePayload = {
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
  startLatitude: number
  startLongitude: number
  endLatitude: number
  endLongitude: number
  status: RouteStatus
  publishedAt?: string | null
}

export type CreateRoutePayload = BaseRoutePayload & {
  progress: RouteProgress
}

export type UpdateRoutePayload = Omit<BaseRoutePayload, 'publishedAt'> & {
  progress: RouteProgress
  publishedAt?: string | null
}

export type CurrentUser = {
  isAuthenticated: boolean
  name?: string
  roles: string[]
  permissions: string[]
  claims: Record<string, string[]>
}

const resolveBaseUrl = () => (
  import.meta.env.VITE_CELIUM_API_URL
    ?? (import.meta.env.PROD ? '/api/celium' : 'http://localhost:5270')
)

const baseUrl = resolveBaseUrl()

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
  apiRequest<RouteModel[]>(`${baseUrl}/routes`, {
    headers: buildHeaders(accessToken),
  })

export const getRoute = async (id: string, accessToken?: string) =>
  apiRequest<RouteModel>(`${baseUrl}/routes/${id}`, {
    headers: buildHeaders(accessToken),
  })

export const createRoute = async (payload: CreateRoutePayload, accessToken?: string) =>
  apiRequest<RouteModel>(`${baseUrl}/routes`, {
    method: 'POST',
    headers: buildHeaders(accessToken, true),
    body: JSON.stringify(payload),
  })

export const updateRoute = async (id: string, payload: UpdateRoutePayload, accessToken?: string) =>
  apiRequest<RouteModel>(`${baseUrl}/routes/${id}`, {
    method: 'PUT',
    headers: buildHeaders(accessToken, true),
    body: JSON.stringify(payload),
  })

export const deleteRoute = async (id: string, accessToken?: string) => {
  await apiRequest<undefined>(`${baseUrl}/routes/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(accessToken),
  })
}

export const canManageRoutes = async (accessToken?: string) => {
  try {
    await apiRequest<{ canManage?: boolean, CanManage?: boolean }>(`${baseUrl}/routes/can-manage`, {
      headers: buildHeaders(accessToken),
    })
    return true
  } catch (error) {
    if (error instanceof ApiError && [401, 403, 404].includes(error.status)) return false
    throw error
  }
}
export const getCurrentUser = async (accessToken?: string) => {
  const headers = buildHeaders(accessToken)
  try {
    const payload = await apiRequest<Record<string, unknown>>(`${baseUrl}/users/me`, { headers })
    return {
      isAuthenticated: Boolean(payload.isAuthenticated ?? payload.IsAuthenticated),
      name: (payload.name ?? payload.Name) as string | undefined,
      roles: ((payload.roles ?? payload.Roles) as string[] | undefined) ?? [],
      permissions: ((payload.permissions ?? payload.Permissions) as string[] | undefined) ?? [],
      claims: ((payload.claims ?? payload.Claims) as Record<string, string[]> | undefined) ?? {},
    } satisfies CurrentUser
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) {
      throw error
    }
  }

  const payload = await apiRequest<Record<string, unknown>>(`${baseUrl}/me`, { headers })

  return {
    isAuthenticated: Boolean(payload.isAuthenticated ?? payload.IsAuthenticated),
    name: (payload.name ?? payload.Name) as string | undefined,
    roles: ((payload.roles ?? payload.Roles) as string[] | undefined) ?? [],
    permissions: ((payload.permissions ?? payload.Permissions) as string[] | undefined) ?? [],
    claims: ((payload.claims ?? payload.Claims) as Record<string, string[]> | undefined) ?? {},
  } satisfies CurrentUser
}
