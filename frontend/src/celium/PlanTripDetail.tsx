import { useContext, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Button from '@/components/buttons/Button'
import SectionHeader from '@/components/layout/SectionHeader'
import { AuthContext } from '@/auth/AuthContext'
import {
  ActivityDetailPanel,
  CompletePlanPanel,
  NotesPanel,
  PlanStatusBadge,
  PreparationPanel,
  RouteForecast,
  TimelineBoard,
} from '@/celium/components/plan'
import usePlanWorkspace from '@/celium/hooks/usePlanWorkspace'
import { getPlanDateLabel } from '@/celium/types/plan'

const PlanTripDetail = () => {
  const { tripId } = useParams()
  const auth = useContext(AuthContext)
  const {
    completeSelectedPlan,
    handleMoveActivity,
    handleReorderDays,
    isLoading,
    selectedActivity,
    selectedDay,
    selectedPlan,
    setSelectedActivityId,
    setSelectedDayId,
    updateChecklistStatus,
    updateNotes,
  } = usePlanWorkspace({
    getAccessToken: auth?.getAccessToken ?? (async () => null),
    planId: tripId,
  })

  const selectedRouteActivity = useMemo(() => {
    if (!selectedPlan) return null
    if (selectedActivity?.type === 'Route') return selectedActivity
    return selectedPlan.days
      .slice()
      .sort((left, right) => left.order - right.order)
      .flatMap((day) => day.activities.slice().sort((left, right) => left.order - right.order))
      .find((activity) => activity.type === 'Route') ?? null
  }, [selectedActivity, selectedPlan])

  if (isLoading) {
    return (
      <section className="grid gap-4">
        <Link to="/apps/celium/plan" className="text-xs text-slate-500 hover:text-emerald-600">
          ← Back to Plan
        </Link>
        <p className="text-sm text-slate-500">Loading planning workspace...</p>
      </section>
    )
  }

  if (!selectedPlan) {
    return (
      <section className="grid gap-4">
        <Link to="/apps/celium/plan" className="text-xs text-slate-500 hover:text-emerald-600">
          ← Back to Plan
        </Link>
        <p className="text-sm text-slate-500">Plan not found.</p>
      </section>
    )
  }

  return (
    <section className="grid gap-6">
      <Link to="/apps/celium/plan" className="text-xs text-slate-500 hover:text-emerald-600">
        ← Back to Plan
      </Link>

      <SectionHeader
        title={selectedPlan.name}
        subtitle="Trip workspace centered on timeline, preparation, and uncertainty."
      />

      <div className="card p-5 grid gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-slate-500">
              {getPlanDateLabel(selectedPlan.metadata.startDate, selectedPlan.metadata.endDate)}
            </p>
          </div>
          <PlanStatusBadge status={selectedPlan.status} />
        </div>
        {selectedRouteActivity ? (
          <RouteForecast
            routeLabel={selectedRouteActivity.title}
            seedKey={selectedRouteActivity.routeId ?? selectedRouteActivity.id}
          />
        ) : (
          <p className="text-sm text-slate-500">Add a route activity to see its mock 7-day forecast.</p>
        )}
      </div>

      <div className="grid xl:grid-cols-[minmax(0,2.1fr)_minmax(320px,1fr)] gap-6 items-start">
        <div className="grid gap-5">
          <section className="card p-5 grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Timeline</p>
              </div>
              <Button type="button" variant="text">Add day</Button>
            </div>
            <TimelineBoard
              onMoveActivity={(sourceDayId, sourceIndex, targetDayId, targetIndex) => {
                void handleMoveActivity(sourceDayId, sourceIndex, targetDayId, targetIndex)
              }}
              onReorderDay={(fromIndex, toIndex) => {
                void handleReorderDays(fromIndex, toIndex)
              }}
              onSelectActivity={setSelectedActivityId}
              onSelectDay={setSelectedDayId}
              plan={selectedPlan}
            />
          </section>

          <PreparationPanel
            onSetStatus={(itemId, status) => {
              void updateChecklistStatus(itemId, status)
            }}
            plan={selectedPlan}
          />
        </div>

        <div className="grid gap-5">
          <ActivityDetailPanel activity={selectedActivity} day={selectedDay} />
          <NotesPanel
            onUpdateNotes={(category, value) => {
              void updateNotes(category, value)
            }}
            plan={selectedPlan}
          />
          <CompletePlanPanel
            onComplete={(reflection) => {
              void completeSelectedPlan(reflection)
            }}
            plan={selectedPlan}
          />
        </div>
      </div>
    </section>
  )
}

export default PlanTripDetail
