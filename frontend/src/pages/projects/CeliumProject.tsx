import { Link } from 'react-router-dom'

const highlights = [
  'Unified routing, planning, and commerce in a single product surface.',
  'Route intelligence with filters, map overlays, and recommendation scaffolding.',
  'Trip workspace that ties routes, notes, and gear into one draft.',
]

const outcomes = [
  { label: 'Focus', value: 'Backcountry network for route-to-gear decisions' },
  { label: 'Primary stack', value: 'React, TypeScript, .NET, PostgreSQL' },
  { label: 'Status', value: 'Active build with CRUD API + app shell' },
]

export default function CeliumProject() {
  return (
    <section className="grid gap-8">
      <header className="grid gap-3">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-600">Project</p>
        <h1 className="section-title">Celium</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
          Celium is a backcountry network that brings route discovery, trip planning, and gear commerce into one cohesive experience.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/apps/celium" className="btn-primary">Launch Celium</Link>
          <Link to="/projects" className="btn-ghost">All Projects</Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
        <div className="card p-6 grid gap-4">
          <h2 className="text-lg font-semibold">What it delivers</h2>
          <ul className="grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            {highlights.map(item => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="card p-6">
          <h2 className="text-lg font-semibold">Outcomes</h2>
          <div className="mt-4 grid gap-3">
            {outcomes.map(outcome => (
              <div key={outcome.label}>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{outcome.label}</p>
                <p className="text-sm text-slate-700 dark:text-slate-200">{outcome.value}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {['Explore', 'Plan', 'Shop'].map(panel => (
          <div key={panel} className="card p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{panel}</p>
            <div className="mt-4 h-36 rounded-2xl bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-emerald-900/40 dark:via-slate-900 dark:to-sky-900/30 border border-slate-200/60 dark:border-slate-800" />
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              Snapshot of the {panel.toLowerCase()} experience inside the Celium app shell.
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
