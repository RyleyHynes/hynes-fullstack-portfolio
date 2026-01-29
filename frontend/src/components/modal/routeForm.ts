import type {
  ActivityType,
  ClimbingStyle,
  Difficulty,
  LoopType,
  RouteProgress,
  RouteStatus,
} from '@/features/api/celiumRoutes'

export type RouteFormState = {
  name: string
  summary: string
  description: string
  activityType: ActivityType | ''
  climbingStyle: ClimbingStyle | ''
  climbingGrade: string
  difficulty: Difficulty | ''
  distanceMiles: string
  elevationGainFt: string
  elevationLossFt: string
  maxElevationFt: string
  minElevationFt: string
  estimatedTimeMinutes: string
  loopType: LoopType | ''
  startLatitude: string
  startLongitude: string
  endLatitude: string
  endLongitude: string
  status: RouteStatus | ''
  progress: RouteProgress
  publishedAt: string
}

export const defaultRouteForm: RouteFormState = {
  name: '',
  summary: '',
  description: '',
  activityType: '',
  climbingStyle: '',
  climbingGrade: '',
  difficulty: '',
  distanceMiles: '',
  elevationGainFt: '',
  elevationLossFt: '',
  maxElevationFt: '',
  minElevationFt: '',
  estimatedTimeMinutes: '',
  loopType: '',
  startLatitude: '',
  startLongitude: '',
  endLatitude: '',
  endLongitude: '',
  status: '',
  progress: 'Todo',
  publishedAt: '',
}
