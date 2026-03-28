import type { PlanDay, PlanModel } from '@/celium/types/plan'

const reorder = <T,>(items: T[], fromIndex: number, toIndex: number) => {
  const next = [...items]
  const [moved] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, moved)
  return next
}

const withReorderedDays = (days: PlanDay[]) => (
  days.map((day, index) => ({
    ...day,
    order: index,
    activities: day.activities.map((activity, activityIndex) => ({
      ...activity,
      dayId: day.id,
      order: activityIndex,
    })),
  }))
)

const usePlanDnd = () => {
  const reorderDays = (plan: PlanModel, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return plan
    const nextDays = reorder(plan.days, fromIndex, toIndex)
    return {
      ...plan,
      days: withReorderedDays(nextDays),
      updatedAt: new Date().toISOString(),
    }
  }

  const moveActivity = (
    plan: PlanModel,
    sourceDayId: string,
    sourceIndex: number,
    targetDayId: string,
    targetIndex: number
  ) => {
    const sourceDay = plan.days.find((day) => day.id === sourceDayId)
    const targetDay = plan.days.find((day) => day.id === targetDayId)
    if (!sourceDay || !targetDay) return plan
    const activity = sourceDay.activities[sourceIndex]
    if (!activity) return plan

    const days = plan.days.map((day) => ({ ...day, activities: [...day.activities] }))
    const nextSource = days.find((day) => day.id === sourceDayId)
    const nextTarget = days.find((day) => day.id === targetDayId)
    if (!nextSource || !nextTarget) return plan

    nextSource.activities.splice(sourceIndex, 1)
    const clampedIndex = Math.max(0, Math.min(targetIndex, nextTarget.activities.length))
    nextTarget.activities.splice(clampedIndex, 0, { ...activity, dayId: targetDayId })

    return {
      ...plan,
      days: withReorderedDays(days),
      updatedAt: new Date().toISOString(),
    }
  }

  return { moveActivity, reorderDays }
}

export default usePlanDnd

