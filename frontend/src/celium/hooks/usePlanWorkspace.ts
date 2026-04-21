import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  completePlan,
  createPlanFromRoute,
  listPlans,
  listRoutesForPlanning,
  savePlan,
} from '@/features/api/planApi'
import type { NoteCategory, PlanModel } from '@/celium/types/plan'
import { buildPlanSummary } from '@/celium/types/plan'
import usePlanDnd from '@/celium/hooks/usePlanDnd'

type UsePlanWorkspaceArgs = {
  getAccessToken: () => Promise<string | null>
  planId?: string
}

const dedupeRouteBackedPlans = (plans: PlanModel[], routeIds: Set<string>) => {
  const claimedRouteIds = new Set<string>()

  return plans.filter((plan) => {
    const attachedRouteId = plan.metadata.attachedRouteIds.find((routeId) => routeIds.has(routeId))
    if (!attachedRouteId) return true
    if (claimedRouteIds.has(attachedRouteId)) return false
    claimedRouteIds.add(attachedRouteId)
    return true
  })
}

const usePlanWorkspace = ({ getAccessToken, planId }: UsePlanWorkspaceArgs) => {
  const [isLoading, setIsLoading] = useState(true)
  const [plans, setPlans] = useState<PlanModel[]>([])
  const [planningRoutes, setPlanningRoutes] = useState<Awaited<ReturnType<typeof listRoutesForPlanning>>>([])
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null)
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(planId ?? null)
  const { moveActivity, reorderDays } = usePlanDnd()

  const load = useCallback(async () => {
    setIsLoading(true)
    const accessToken = await getAccessToken()
    const [initialPlans, routes] = await Promise.all([
      listPlans(),
      listRoutesForPlanning(accessToken ?? undefined),
    ])

    let allPlans = [...initialPlans]
    for (const route of routes) {
      const alreadyAttached = allPlans.some((plan) => plan.metadata.attachedRouteIds.includes(route.id))
      if (alreadyAttached) continue
      const created = await createPlanFromRoute(route)
      allPlans = [created, ...allPlans]
    }
    allPlans = dedupeRouteBackedPlans(allPlans, new Set(routes.map((route) => route.id)))

    setPlans(allPlans)
    setPlanningRoutes(routes)
    setSelectedPlanId((current) => current ?? allPlans[0]?.id ?? null)
    setIsLoading(false)
  }, [getAccessToken])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!planId) return
    setSelectedPlanId(planId)
  }, [planId])

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? null,
    [plans, selectedPlanId]
  )

  const selectedDay = useMemo(
    () => selectedPlan?.days.find((day) => day.id === selectedDayId) ?? null,
    [selectedDayId, selectedPlan]
  )

  const selectedActivity = useMemo(
    () => selectedPlan?.days.flatMap((day) => day.activities).find((activity) => activity.id === selectedActivityId) ?? null,
    [selectedActivityId, selectedPlan]
  )

  const routePlanningTargets = useMemo(() => {
    return planningRoutes.reduce<Record<string, string>>((accumulator, route) => {
      const owningPlan = plans.find((plan) => plan.metadata.attachedRouteIds.includes(route.id))
      if (owningPlan) {
        accumulator[route.id] = owningPlan.id
      }
      return accumulator
    }, {})
  }, [planningRoutes, plans])

  const routeProgressByPlanId = useMemo(() => {
    return plans.reduce<Record<string, 'Todo' | 'Completed'>>((accumulator, plan) => {
      const attachedRoute = planningRoutes.find((route) => plan.metadata.attachedRouteIds.includes(route.id))
      if (attachedRoute) {
        accumulator[plan.id] = attachedRoute.progress
      }
      return accumulator
    }, {})
  }, [planningRoutes, plans])

  const persistPlan = useCallback(async (plan: PlanModel) => {
    const saved = await savePlan(plan)
    setPlans((current) => current.map((item) => (item.id === saved.id ? saved : item)))
  }, [])

  const setSelectedPlan = useCallback((nextPlanId: string) => {
    setSelectedPlanId(nextPlanId)
    setSelectedActivityId(null)
    setSelectedDayId(null)
  }, [])

  const handleReorderDays = useCallback(async (fromIndex: number, toIndex: number) => {
    if (!selectedPlan) return
    const reordered = reorderDays(selectedPlan, fromIndex, toIndex)
    await persistPlan(reordered)
  }, [persistPlan, reorderDays, selectedPlan])

  const handleMoveActivity = useCallback(async (sourceDayId: string, sourceIndex: number, targetDayId: string, targetIndex: number) => {
    if (!selectedPlan) return
    const moved = moveActivity(selectedPlan, sourceDayId, sourceIndex, targetDayId, targetIndex)
    await persistPlan(moved)
  }, [moveActivity, persistPlan, selectedPlan])

  const updateChecklistStatus = useCallback(async (itemId: string, status: PlanModel['checklistItems'][number]['status']) => {
    if (!selectedPlan) return
    const next = {
      ...selectedPlan,
      checklistItems: selectedPlan.checklistItems.map((item) => (
        item.id === itemId ? { ...item, status } : item
      )),
    }
    await persistPlan(next)
  }, [persistPlan, selectedPlan])

  const createChecklistItem = useCallback(async (label: string) => {
    if (!selectedPlan) return
    const next = {
      ...selectedPlan,
      checklistItems: [
        ...selectedPlan.checklistItems,
        {
          category: 'Checklist' as const,
          id: `prep-${Date.now()}`,
          label,
          status: 'NotStarted' as const,
        },
      ],
    }
    await persistPlan(next)
  }, [persistPlan, selectedPlan])

  const updateChecklistItem = useCallback(async (itemId: string, updates: { description?: string, label: string }) => {
    if (!selectedPlan) return
    const next = {
      ...selectedPlan,
      checklistItems: selectedPlan.checklistItems.map((item) => (
        item.id === itemId
          ? {
            ...item,
            description: updates.description,
            label: updates.label,
          }
          : item
      )),
    }
    await persistPlan(next)
  }, [persistPlan, selectedPlan])

  const updateNotes = useCallback(async (category: NoteCategory, value: string) => {
    if (!selectedPlan) return
    await persistPlan({
      ...selectedPlan,
      notes: {
        ...selectedPlan.notes,
        [category]: value,
      },
    })
  }, [persistPlan, selectedPlan])

  const completeSelectedPlan = useCallback(async (reflection: string) => {
    if (!selectedPlan) return null
    const completed = await completePlan(selectedPlan.id, reflection)
    if (!completed) return null
    setPlans((current) => current.map((plan) => (plan.id === completed.id ? completed : plan)))
    return completed
  }, [selectedPlan])

  const summaries = useMemo(() => plans.map(buildPlanSummary), [plans])

  return {
    completeSelectedPlan,
    createChecklistItem,
    handleMoveActivity,
    handleReorderDays,
    isLoading,
    planSummaries: summaries,
    reload: load,
    routePlanningTargets,
    selectedActivity,
    selectedDay,
    selectedPlan,
    selectedPlanId,
    setSelectedActivityId,
    setSelectedDayId,
    setSelectedPlan,
    planningRoutes,
    routeProgressByPlanId,
    updateChecklistItem,
    updateChecklistStatus,
    updateNotes,
  }
}

export default usePlanWorkspace
