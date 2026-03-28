import type { ChecklistStatus, PlanModel } from '@/celium/types/plan'

type PreparationPanelProps = {
  onSetStatus: (itemId: string, status: ChecklistStatus) => void
  plan: PlanModel
}

const statusOptions: ChecklistStatus[] = ['NotStarted', 'InProgress', 'Done']

const PreparationPanel = ({ onSetStatus, plan }: PreparationPanelProps) => {
  return (
    <section className="card p-5 grid gap-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Preparation</p>
      <div className="grid gap-3">
        {plan.checklistItems.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200/70 dark:border-slate-800 p-3 grid gap-2">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-sm">{item.label}</p>
              <span className="text-xs text-slate-400">{item.category}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  className={`badge ${item.status === status ? 'border-emerald-400 text-emerald-700' : ''}`}
                  onClick={() => onSetStatus(item.id, status)}
                  type="button"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PreparationPanel

