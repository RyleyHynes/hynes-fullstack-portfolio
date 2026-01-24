import { Link, useParams } from 'react-router-dom'

const itinerary = [
  { day: 'Day 1', route: 'Skyline Ridge Traverse', note: 'Summit push + sunset camp' },
  { day: 'Day 2', route: 'Glass Creek Loop', note: 'Recovery loop + exit' },
]

const packing = ['Cold-weather layers', 'Water filter', 'Emergency bivy', 'Route printouts']

export default function PlanTripDetail() {
  const { tripId } = useParams()

  return (
    <section className="grid gap-6">
      <Link to="/apps/celium/plan" className="text-xs text-slate-500 hover:text-emerald-600">
        ← Back to Plan
      </Link>

      <header className="grid gap-2">
        <h1 className="text-3xl font-semibold">October Snowline Scout</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
          Two-day itinerary built around stable pressure and an early-season snowline check.
        </p>
        <p className="text-xs text-slate-400">Trip ID: {tripId}</p>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
        <div className="card p-6">
          <h2 className="text-lg font-semibold">Itinerary</h2>
          <div className="mt-4 grid gap-3">
            {itinerary.map(item => (
              <div key={item.day} className="rounded-xl border border-slate-200/70 dark:border-slate-800 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.day}</p>
                <p className="mt-1 font-semibold">{item.route}</p>
                <p className="text-sm text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="card p-6">
          <h2 className="text-lg font-semibold">Packing</h2>
          <ul className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            {packing.map(item => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
          <button className="mt-4 btn-ghost">Apply Template</button>
        </aside>
      </div>
    </section>
  )
}
