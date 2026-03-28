import { useState } from 'react'
import Button from '@/components/buttons/Button'
import type { PlanModel } from '@/celium/types/plan'

type CompletePlanPanelProps = {
  onComplete: (reflection: string) => void
  plan: PlanModel
}

const CompletePlanPanel = ({ onComplete, plan }: CompletePlanPanelProps) => {
  const [reflection, setReflection] = useState(plan.metadata.reflection ?? '')

  return (
    <section className="card p-5 grid gap-3">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Completion / Reflection</p>
      <textarea
        className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm min-h-24"
        onChange={(event) => setReflection(event.target.value)}
        placeholder="How did this trip compare to plan? What should change next time?"
        value={reflection}
      />
      <Button
        disabled={plan.status === 'Completed'}
        onClick={() => onComplete(reflection)}
        type="button"
        variant="primary"
      >
        {plan.status === 'Completed' ? 'Trip completed' : 'Mark trip complete'}
      </Button>
    </section>
  )
}

export default CompletePlanPanel

