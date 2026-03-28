import type { PlanSummary } from '@/celium/types/plan'
import PlanStatusBadge from '@/celium/components/plan/PlanStatusBadge'

type PlanCardProps = {
  isSelected: boolean
  onSelect: () => void
  summary: PlanSummary
}

const PlanCard = ({ isSelected, onSelect, summary }: PlanCardProps) => {
  return (
    <button
      className={`w-full text-left rounded-2xl border px-4 py-3 transition-colors ${isSelected ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20' : 'border-slate-200/70 dark:border-slate-800 hover:border-emerald-300'}`}
      onClick={onSelect}
      type="button"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{summary.name}</p>
        </div>
        <PlanStatusBadge status={summary.status} />
      </div>
    </button>
  )
}

export default PlanCard
