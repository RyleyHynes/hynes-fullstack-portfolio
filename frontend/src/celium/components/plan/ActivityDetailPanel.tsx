import type { PlanActivity, PlanDay } from '@/celium/types/plan'

type ActivityDetailPanelProps = {
  activity: PlanActivity | null
  day: PlanDay | null
}

const ActivityDetailPanel = ({ activity, day }: ActivityDetailPanelProps) => {
  if (!activity && !day) {
    return null
  }

  const description = activity?.notes || day?.notes || 'No route description has been added yet.'
  const protectionItems = activity?.type === 'Route'
    ? [
      'Helmet and emergency layer recommended for variable exposure.',
      'Carry offline map + backup navigation for route-finding sections.',
      'Assess objective hazards before committing to upper terrain.',
    ]
    : [
      'Confirm communication plan and turnaround timing.',
      'Carry backup lighting and emergency weather layer.',
      'Validate access, closures, and local restrictions.',
    ]
  const checklistItems = [
    { label: 'Weather window reviewed', done: Boolean(activity?.conditionsContext) },
    { label: 'Approach and exit plan confirmed', done: Boolean(description) },
    { label: 'Route-specific gear packed', done: false },
  ]

  return (
    <section className="grid gap-4">
      <div className="card p-5 grid gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Description</p>
        <h3 className="text-lg font-semibold">{activity?.title || day?.title || 'Route detail'}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <div className="card p-5 grid gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Protection</p>
        <ul className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
          {protectionItems.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-5 grid gap-2">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Checklist</p>
        <div className="grid gap-2">
          {checklistItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-xl border border-slate-200/70 dark:border-slate-800 px-3 py-2"
            >
              <p className="text-sm">{item.label}</p>
              <span className={`text-xs font-medium ${item.done ? 'text-emerald-600' : 'text-slate-500'}`}>
                {item.done ? 'Done' : 'Todo'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ActivityDetailPanel
