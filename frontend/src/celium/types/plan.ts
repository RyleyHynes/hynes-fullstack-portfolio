import type { RouteModel } from '@/features/api/celiumRoutes'

export type PlanStatus = 'Draft' | 'Planned' | 'InProgress' | 'Completed'
export type ChecklistStatus = 'NotStarted' | 'InProgress' | 'Done'
export type NoteCategory = 'TripNotes' | 'PackingNotes' | 'RisksUnknowns' | 'RemainingQuestions'

export type PlanActivity = {
  conditionsContext?: string
  dayId: string
  distanceMiles?: number
  elevationGainFt?: number
  id: string
  notes?: string
  order: number
  routeId?: string
  title: string
  type: 'Route' | 'Task'
}

export type PlanDay = {
  activities: PlanActivity[]
  dateLabel?: string
  id: string
  notes?: string
  order: number
  title: string
}

export type ChecklistItem = {
  category: 'Checklist' | 'Gear' | 'Logistics' | 'Permits'
  id: string
  label: string
  status: ChecklistStatus
}

export type PlanNotes = Record<NoteCategory, string>

export type PlanConditionsContext = {
  forecastSummary: string
  recentObservations: string
  seasonalContext: string
}

export type PlanMetadata = {
  attachedRouteIds: string[]
  confidence: number
  endDate?: string
  reflection?: string
  startDate?: string
}

export type PlanModel = {
  checklistItems: ChecklistItem[]
  conditions: PlanConditionsContext
  createdAt: string
  days: PlanDay[]
  id: string
  metadata: PlanMetadata
  name: string
  notes: PlanNotes
  status: PlanStatus
  updatedAt: string
}

export type PlanSummary = {
  attachedRoutes: number
  dateLabel: string
  id: string
  name: string
  readiness: number
  status: PlanStatus
}

const toIsoDate = (value: Date) => value.toISOString().slice(0, 10)

export const getPlanDateLabel = (startDate?: string, endDate?: string) => {
  if (startDate && endDate) return `${startDate} - ${endDate}`

  const today = new Date()
  const plusSeven = new Date(today)
  plusSeven.setDate(today.getDate() + 7)
  return `${toIsoDate(today)} - ${toIsoDate(plusSeven)}`
}

export const buildPlanSummary = (plan: PlanModel): PlanSummary => {
  const dateLabel = getPlanDateLabel(plan.metadata.startDate, plan.metadata.endDate)
  const doneCount = plan.checklistItems.filter((item) => item.status === 'Done').length
  const readiness = plan.checklistItems.length
    ? Math.round((doneCount / plan.checklistItems.length) * 100)
    : 0

  return {
    attachedRoutes: plan.metadata.attachedRouteIds.length,
    dateLabel,
    id: plan.id,
    name: plan.name,
    readiness,
    status: plan.status,
  }
}

export const mapRouteToActivity = (route: RouteModel, dayId: string, order: number): PlanActivity => ({
  conditionsContext: `Weather context for ${route.name} is pending latest route-specific observations.`,
  dayId,
  distanceMiles: route.distanceMiles,
  elevationGainFt: route.elevationGainFt,
  id: `activity-${route.id}-${Date.now()}`,
  notes: route.summary,
  order,
  routeId: route.id,
  title: route.name,
  type: 'Route',
})
