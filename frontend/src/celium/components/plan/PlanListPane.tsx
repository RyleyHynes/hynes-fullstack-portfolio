import type { PlanSummary } from '@/celium/types/plan'
import Button from '@/components/buttons/Button'
import PlanCard from '@/celium/components/plan/PlanCard'

type PlanListPaneProps = {
  planFilter: 'todo' | 'completed'
  setPlanFilter: (value: 'todo' | 'completed') => void
  plans: PlanSummary[]
  selectedPlanId: string | null
  onSelectPlan: (planId: string) => void
}

const PlanListPane = ({ planFilter, plans, selectedPlanId, setPlanFilter, onSelectPlan }: PlanListPaneProps) => {
  return (
    <aside className="card p-4 grid gap-3 h-fit lg:sticky lg:top-24">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Plans</p>
      <div className="flex items-center gap-2 text-sm">
        <Button
          className={planFilter === 'todo' ? 'border-emerald-400 text-emerald-700' : ''}
          onClick={() => setPlanFilter('todo')}
          type="button"
          variant="text"
        >
          To do
        </Button>
        <Button
          className={planFilter === 'completed' ? 'border-emerald-400 text-emerald-700' : ''}
          onClick={() => setPlanFilter('completed')}
          type="button"
          variant="text"
        >
          Completed
        </Button>
      </div>
      <div className="grid gap-3 max-h-[65vh] overflow-y-auto pr-1">
        {plans.map((summary) => (
          <PlanCard
            key={summary.id}
            isSelected={summary.id === selectedPlanId}
            onSelect={() => onSelectPlan(summary.id)}
            summary={summary}
          />
        ))}
        {plans.length === 0 ? (
          <p className="text-sm text-slate-500 px-1">No plans in this list yet.</p>
        ) : null}
      </div>
    </aside>
  )
}

export default PlanListPane
