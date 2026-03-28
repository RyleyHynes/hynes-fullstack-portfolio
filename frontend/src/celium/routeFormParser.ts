import type {
  CreateRoutePayload,
  UpdateRoutePayload,
} from '@/features/api/celiumRoutes'
import type { RouteFormState } from '@/components/modal/routeForm'

type ParseResult<T> = { ok: true, value: T } | { ok: false, error: string }

const parseCoordinate = (raw: string, kind: 'lat' | 'lng') => {
  const value = raw.trim().toUpperCase()
  if (!value) return null
  const match = value.match(/^(-?\d+(?:\.\d+)?)([NSEW])?$/)
  if (!match) return null

  let numeric = Number(match[1])
  const suffix = match[2]
  if (suffix) {
    if (suffix === 'S' || suffix === 'W') numeric = Math.abs(numeric) * -1
    if (suffix === 'N' || suffix === 'E') numeric = Math.abs(numeric)
  }

  if (kind === 'lat' && (numeric < -90 || numeric > 90)) return null
  if (kind === 'lng' && (numeric < -180 || numeric > 180)) return null
  return numeric
}

const validateRequired = (form: RouteFormState) => {
  const requiredFields = [
    form.name,
    form.summary,
    form.distanceMiles,
    form.elevationGainFt,
    form.activityType,
    form.difficulty,
    form.loopType,
    form.status,
    form.startLatitude,
    form.startLongitude,
    form.endLatitude,
    form.endLongitude,
  ]

  if (requiredFields.some((value) => value.trim().length === 0)) {
    return 'Please complete all required fields.'
  }

  if (form.activityType === 'RockClimbing') {
    if (!form.climbingStyle) {
      return 'Please select a climbing style.'
    }
    if (form.climbingGrade.trim().length === 0) {
      return 'Please select a climbing grade.'
    }
  }

  return null
}

const parsePayloadBase = (form: RouteFormState) => {
  const requiredError = validateRequired(form)
  if (requiredError) return { ok: false, error: requiredError } as const

  const startLatitude = parseCoordinate(form.startLatitude, 'lat')
  const startLongitude = parseCoordinate(form.startLongitude, 'lng')
  const endLatitude = parseCoordinate(form.endLatitude, 'lat')
  const endLongitude = parseCoordinate(form.endLongitude, 'lng')
  if (startLatitude === null || startLongitude === null || endLatitude === null || endLongitude === null) {
    return {
      ok: false,
      error: 'Coordinates must be valid decimal degrees or include N/S/E/W (e.g. 46.7865N, -121.7352).',
    } as const
  }

  if (!form.activityType || !form.difficulty || !form.loopType || !form.status) {
    return { ok: false, error: 'Required select values are missing.' } as const
  }

  return {
    ok: true,
    value: {
      activityType: form.activityType,
      climbingGrade: form.activityType === 'RockClimbing' ? (form.climbingGrade || null) : null,
      climbingStyle: form.activityType === 'RockClimbing' ? (form.climbingStyle || null) : null,
      description: form.description || null,
      difficulty: form.difficulty,
      distanceMiles: Number(form.distanceMiles),
      elevationGainFt: Number(form.elevationGainFt),
      elevationLossFt: form.elevationLossFt ? Number(form.elevationLossFt) : null,
      endLatitude,
      endLongitude,
      estimatedTimeMinutes: form.estimatedTimeMinutes ? Number(form.estimatedTimeMinutes) : null,
      loopType: form.loopType,
      maxElevationFt: form.maxElevationFt ? Number(form.maxElevationFt) : null,
      minElevationFt: form.minElevationFt ? Number(form.minElevationFt) : null,
      name: form.name.trim(),
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      startLatitude,
      startLongitude,
      status: form.status,
      summary: form.summary.trim(),
    },
  } as const
}

export const parseCreateRoutePayload = (form: RouteFormState): ParseResult<CreateRoutePayload> => {
  const parsed = parsePayloadBase(form)
  if (!parsed.ok) return parsed
  return {
    ok: true,
    value: {
      ...parsed.value,
      progress: form.progress,
    },
  }
}

export const parseUpdateRoutePayload = (form: RouteFormState): ParseResult<UpdateRoutePayload> => {
  const parsed = parsePayloadBase(form)
  if (!parsed.ok) return parsed
  return {
    ok: true,
    value: {
      ...parsed.value,
      progress: form.progress,
    },
  }
}

