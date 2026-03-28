import { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/buttons/Button'
import SectionHeader from '@/components/layout/SectionHeader'
import { AuthContext } from '@/auth/AuthContext'
import {
  PlanListPane,
  PlanStatusBadge,
} from '@/celium/components/plan'
import usePlanWorkspace from '@/celium/hooks/usePlanWorkspace'

const Plan = () => {
  const [planFilter, setPlanFilter] = useState<'todo' | 'completed'>('todo')
  const auth = useContext(AuthContext)
  const {
    isLoading,
    planSummaries,
    routePlanningTargets,
    selectedPlan,
    selectedPlanId,
    setSelectedPlan,
  } = usePlanWorkspace({ getAccessToken: auth?.getAccessToken ?? (async () => null) })

  const todoPlanIds = useMemo(
    () => new Set(Object.values(routePlanningTargets)),
    [routePlanningTargets]
  )

  const visiblePlanSummaries = useMemo(() => {
    if (planFilter === 'completed') {
      return planSummaries.filter((summary) => summary.status === 'Completed')
    }
    return planSummaries.filter((summary) => todoPlanIds.has(summary.id))
  }, [planFilter, planSummaries, todoPlanIds])

  useEffect(() => {
    if (visiblePlanSummaries.some((summary) => summary.id === selectedPlanId)) return
    if (!visiblePlanSummaries[0]) return
    setSelectedPlan(visiblePlanSummaries[0].id)
  }, [selectedPlanId, setSelectedPlan, visiblePlanSummaries])

  return (
    <section className="grid gap-6">
      <SectionHeader
        eyebrow="Plan"
        title="Build a trip that stacks the odds in your favor."
        subtitle="A timeline of intent, preparation, and uncertainty. Move from idea to commitment."
      />

      <div className="grid lg:grid-cols-[minmax(240px,1.1fr)_minmax(0,2fr)] gap-6 items-start">
        <PlanListPane
          planFilter={planFilter}
          plans={visiblePlanSummaries}
          selectedPlanId={selectedPlanId}
          setPlanFilter={setPlanFilter}
          onSelectPlan={setSelectedPlan}
        />

        <div className="grid gap-5">
          <section className="card p-5 grid gap-4">
            {isLoading ? (
              <p className="text-sm text-slate-500">Loading plans...</p>
            ) : null}
            {!isLoading && !selectedPlan ? (
              <p className="text-sm text-slate-500">No plan selected yet.</p>
            ) : null}
            {selectedPlan ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Selected Plan</p>
                    <h2 className="text-2xl font-semibold mt-1">{selectedPlan.name}</h2>
                  </div>
                  <PlanStatusBadge status={selectedPlan.status} />
                </div>
                <div className="grid gap-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Timeline Preview</p>
                  {selectedPlan.days
                    .slice()
                    .sort((left, right) => left.order - right.order)
                    .map((day) => (
                      <div key={day.id} className="rounded-xl border border-slate-200/70 dark:border-slate-800 px-3 py-2">
                        <p className="text-sm font-medium">{day.title}</p>
                        <p className="text-xs text-slate-500">{day.activities.length} activities</p>
                      </div>
                    ))}
                </div>
                <Link to={`/apps/celium/plan/trips/${selectedPlan.id}`}>
                  <Button type="button" variant="primary">Open planning workspace</Button>
                </Link>
              </>
            ) : null}
          </section>
        </div>

      </div>
    </section>
  )
}

export default Plan
