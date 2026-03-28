import Badge from '@/components/data-display/Badge'
import type { PlanStatus } from '@/celium/types/plan'

type PlanStatusBadgeProps = {
  status: PlanStatus
}

const statusClassName: Record<PlanStatus, string> = {
  Draft: 'border-slate-300 text-slate-600',
  Planned: 'border-emerald-300 text-emerald-700',
  InProgress: 'border-sky-300 text-sky-700',
  Completed: 'border-violet-300 text-violet-700',
}

const PlanStatusBadge = ({ status }: PlanStatusBadgeProps) => (
  <Badge className={statusClassName[status]}>{status}</Badge>
)

export default PlanStatusBadge

