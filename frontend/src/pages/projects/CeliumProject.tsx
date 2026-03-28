import { Link } from 'react-router-dom'

const highlights = [
  {
    title: 'Explore — interactive route discovery and shared experience',
    body: 'A discovery surface for hiking, running, and mountaineering routes, combining map-based exploration, filters, completion tracking, and community-contributed observations that build shared context over time.',
  },
  {
    title: 'Plan — a workspace for preparation, not prescriptions',
    body: 'A planning module that allows users to select routes, set dates, review weather signals, and organize preparation through curated checklists, maps, and supporting tools—without directing decisions.',
  },
  {
    title: 'Support — sustaining the platform',
    body: 'A lightweight support surface that demonstrates commerce workflows and provides a way for users to contribute to ongoing application development and future features.',
  },
]

const outcomes = [
  { label: 'Focus', value: 'Backcountry network for route-to-gear decisions' },
  { label: 'Primary stack', value: 'React, TypeScript, .NET, PostgreSQL' },
  { label: 'Status', value: 'Active build with CRUD API + app shell' },
]

const CeliumProject = () => {
  const publicBase = import.meta.env.BASE_URL || '/'

  return (
    <section className="grid gap-8">
      <header className="grid gap-3">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-600">Project</p>
        <h1 className="section-title">Celium</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-3xl">
          Built on connection.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/apps/celium" className="btn-primary">Launch Celium</Link>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
        <div className="card p-6 grid gap-4">
          <h2 className="text-lg font-semibold">What it delivers</h2>
          <div className="grid gap-4">
            {highlights.map(item => (
              <div key={item.title} className="grid gap-2">
                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{item.body}</p>
              </div>
            ))}
          </div>
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
        {[
          { title: 'Explore', copy: 'Find routes and see how others experienced them.', image: `${publicBase}explore.png` },
          { title: 'Plan', copy: 'Turn routes into trip drafts.', image: `${publicBase}plan.png` },
          { title: 'Support', copy: 'Help sustain ongoing development.', image: `${publicBase}shop.png` },
        ].map(panel => (
          <div key={panel.title} className="card p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{panel.title}</p>
            <div className="mt-4 h-36 overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800">
              <img
                src={panel.image}
                alt={`${panel.title} panel illustration`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
              {panel.copy}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CeliumProject
