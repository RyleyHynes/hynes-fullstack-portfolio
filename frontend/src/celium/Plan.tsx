import { Link } from 'react-router-dom'

const trips = [
  { id: 'oct-snowline', name: 'October Snowline Scout', dates: 'Oct 12–15', routes: 2 },
  { id: 'fall-gear-test', name: 'Fall Gear Test', dates: 'Nov 3–4', routes: 1 },
]

export default function Plan() {
  return (
    <section className="grid gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-600">Plan</p>
        <h1 className="text-3xl font-semibold">Build a trip that stacks the odds in your favor.</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
          Organize routes, dates, participants, and packing in one place. Celium connects route context to the plan.
        </p>
      </header>

      <div className="flex items-center gap-4 text-sm text-slate-500">
        <span className="font-semibold text-emerald-600">Trips</span>
        <span>Packing</span>
        <span>Notes</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {trips.map(trip => (
          <Link key={trip.id} to={`/apps/celium/plan/trips/${trip.id}`} className="card p-5 hover:border-emerald-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{trip.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{trip.dates}</p>
              </div>
              <span className="badge">{trip.routes} routes</span>
            </div>
            <p className="mt-3 text-sm text-slate-500">
              Draft itinerary with shared gear checklist and weather notes.
            </p>
          </Link>
        ))}
        <div className="card p-5 border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
          <p className="text-sm">Start a new trip from a saved route or itinerary template.</p>
          <button className="mt-4 btn-ghost">Create Trip</button>
        </div>
      </div>
    </section>
  )
}
