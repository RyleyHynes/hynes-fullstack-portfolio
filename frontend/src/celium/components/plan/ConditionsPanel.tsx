import type { PlanModel } from '@/celium/types/plan'

type ConditionsPanelProps = {
  plan: PlanModel
}

const ConditionsPanel = ({ plan }: ConditionsPanelProps) => {
  return (
    <section className="card p-5 grid gap-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Conditions Context (Read-only)</p>
      <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 p-3">
        <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">Forecast</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{plan.conditions.forecastSummary}</p>
      </div>
      <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 p-3">
        <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">Seasonal context</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{plan.conditions.seasonalContext}</p>
      </div>
      <div className="rounded-xl border border-slate-200/70 dark:border-slate-800 p-3">
        <p className="text-xs text-slate-400 uppercase tracking-[0.2em]">Recent observations</p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{plan.conditions.recentObservations}</p>
      </div>
      <p className="text-xs text-slate-400">
        Context supports decision-making. It should not be treated as a command.
      </p>
    </section>
  )
}

export default ConditionsPanel

