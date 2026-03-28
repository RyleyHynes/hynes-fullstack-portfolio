import { listRoutes, type RouteModel } from '@/features/api/celiumRoutes'
import type { PlanModel } from '@/celium/types/plan'
import { mapRouteToActivity } from '@/celium/types/plan'

const STORAGE_KEY = 'celium:plans:v1'

const isoNow = () => new Date().toISOString()

const seedPlans = (): PlanModel[] => {
  const now = isoNow()
  return [
    {
      id: 'plan-matterhorn-journey',
      name: 'Matterhorn Mountaineering Journey',
      status: 'Planned',
      createdAt: now,
      updatedAt: now,
      metadata: {
        attachedRouteIds: [],
        confidence: 62,
        startDate: '2026-08-10',
        endDate: '2026-08-15',
      },
      days: [
        {
          id: 'day-1',
          order: 0,
          title: 'Day 1 - Arrival',
          notes: 'Travel, lodging setup, and local weather brief.',
          activities: [
            { id: 'activity-arrival', dayId: 'day-1', order: 0, title: 'Arrival logistics', type: 'Task', notes: 'Check transport and weather updates.' },
          ],
        },
        {
          id: 'day-2',
          order: 1,
          title: 'Day 2 - Acclimatization',
          activities: [
            { id: 'activity-acclimatization', dayId: 'day-2', order: 0, title: 'Acclimatization hike', type: 'Task', notes: 'Keep output moderate.' },
          ],
        },
        {
          id: 'day-3',
          order: 2,
          title: 'Day 3 - Hut Approach',
          activities: [
            { id: 'activity-hut-approach', dayId: 'day-3', order: 0, title: 'Hut approach and prep', type: 'Task' },
          ],
        },
        {
          id: 'day-4',
          order: 3,
          title: 'Day 4 - Summit Push',
          activities: [
            { id: 'activity-summit', dayId: 'day-4', order: 0, title: 'Summit push window', type: 'Task', notes: 'Go/no-go at first light.' },
          ],
        },
        {
          id: 'day-5',
          order: 4,
          title: 'Day 5 - Buffer / Exit',
          activities: [
            { id: 'activity-exit', dayId: 'day-5', order: 0, title: 'Buffer and descent', type: 'Task' },
          ],
        },
      ],
      checklistItems: [
        { id: 'check-1', category: 'Gear', label: 'Crampons fit check', status: 'InProgress' },
        { id: 'check-2', category: 'Permits', label: 'Hut reservation confirmation', status: 'Done' },
        { id: 'check-3', category: 'Logistics', label: 'Transport backup plan', status: 'NotStarted' },
        { id: 'check-4', category: 'Checklist', label: 'Weather window review', status: 'InProgress' },
      ],
      notes: {
        TripNotes: 'Plan is paced for acclimatization and buffer time.',
        PackingNotes: 'Layering for windchill and overnight swings.',
        RisksUnknowns: 'Unknown fixed rope condition; changing freeze-thaw cycle.',
        RemainingQuestions: 'Guide requirement? Snow bridge reliability?',
      },
      conditions: {
        forecastSummary: 'Forecast indicates mixed wind and stable temperatures through Day 4.',
        seasonalContext: 'Late summer shoulder conditions with variable overnight freeze.',
        recentObservations: 'Recent reports mention intermittent rockfall near usual lines.',
      },
    },
  ]
}

const getPlansFromStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return seedPlans()
  try {
    const parsed = JSON.parse(raw) as PlanModel[]
    if (!Array.isArray(parsed) || parsed.length === 0) return seedPlans()
    return parsed
  } catch {
    return seedPlans()
  }
}

const savePlansToStorage = (plans: PlanModel[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
}

const upsertPlan = (plan: PlanModel) => {
  const plans = getPlansFromStorage()
  const nextPlans = plans.some((existing) => existing.id === plan.id)
    ? plans.map((existing) => (existing.id === plan.id ? plan : existing))
    : [plan, ...plans]
  savePlansToStorage(nextPlans)
  return plan
}

export const listPlans = async () => getPlansFromStorage()

export const getPlanById = async (planId: string) => {
  const plan = getPlansFromStorage().find((item) => item.id === planId)
  return plan ?? null
}

export const savePlan = async (plan: PlanModel) => {
  const updated = {
    ...plan,
    updatedAt: isoNow(),
  }
  return upsertPlan(updated)
}

export const listTodoRoutesForPlanning = async (accessToken?: string) => {
  const routes = await listRoutes(accessToken)
  return routes.filter((route) => route.progress === 'Todo')
}

export const createPlanFromRoute = async (route: RouteModel) => {
  const now = isoNow()
  const dayId = `day-${route.id}`
  const plan: PlanModel = {
    id: `plan-${route.id}-${Date.now()}`,
    name: `${route.name} Plan`,
    status: 'Draft',
    createdAt: now,
    updatedAt: now,
    metadata: {
      attachedRouteIds: [route.id],
      confidence: 40,
    },
    days: [
      {
        id: dayId,
        order: 0,
        title: 'Day 1 - Route objective',
        activities: [mapRouteToActivity(route, dayId, 0)],
      },
    ],
    checklistItems: [
      { id: `check-${route.id}-1`, category: 'Checklist', label: 'Confirm objective timeline', status: 'NotStarted' },
      { id: `check-${route.id}-2`, category: 'Gear', label: 'Validate route-specific gear', status: 'NotStarted' },
      { id: `check-${route.id}-3`, category: 'Logistics', label: 'Finalize transport and timing', status: 'NotStarted' },
    ],
    notes: {
      TripNotes: '',
      PackingNotes: '',
      RisksUnknowns: '',
      RemainingQuestions: '',
    },
    conditions: {
      forecastSummary: 'Conditions summary pending.',
      seasonalContext: 'Season context pending.',
      recentObservations: 'Recent observations pending.',
    },
  }
  return upsertPlan(plan)
}

export const addRouteToPlan = async (planId: string, route: RouteModel) => {
  const plan = await getPlanById(planId)
  if (!plan) return null

  const firstDay = plan.days[0] ?? {
    id: `day-${Date.now()}`,
    order: 0,
    title: 'Day 1 - Objective',
    activities: [],
  }

  const days = plan.days.length ? [...plan.days] : [firstDay]
  const targetDay = days[0]
  const nextOrder = targetDay.activities.length
  targetDay.activities = [...targetDay.activities, mapRouteToActivity(route, targetDay.id, nextOrder)]

  const updated: PlanModel = {
    ...plan,
    days: days.map((day, index) => ({ ...day, order: index })),
    metadata: {
      ...plan.metadata,
      attachedRouteIds: Array.from(new Set([...plan.metadata.attachedRouteIds, route.id])),
    },
    updatedAt: isoNow(),
  }

  return upsertPlan(updated)
}

export const completePlan = async (planId: string, reflection: string) => {
  const plan = await getPlanById(planId)
  if (!plan) return null
  return upsertPlan({
    ...plan,
    status: 'Completed',
    metadata: {
      ...plan.metadata,
      reflection,
    },
    updatedAt: isoNow(),
  })
}

