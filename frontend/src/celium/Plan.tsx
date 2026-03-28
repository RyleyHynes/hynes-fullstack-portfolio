import { Link } from 'react-router-dom'
import Button from '@/components/buttons/Button'
import Badge from '@/components/data-display/Badge'
import CardHeader from '@/components/layout/CardHeader'
import EmptyState from '@/components/data-display/EmptyState'
import SectionHeader from '@/components/layout/SectionHeader'

const trips = [
  { id: 'oct-snowline', name: 'October Snowline Scout', dates: 'Oct 12–15', routes: 2 },
  { id: 'fall-gear-test', name: 'Fall Gear Test', dates: 'Nov 3–4', routes: 1 },
]

const Plan = () => {
  return (
    <section className="grid gap-6">
      <SectionHeader
        eyebrow="Plan"
        title="Build a trip that stacks the odds in your favor."
        subtitle="Organize routes, dates, participants, and packing in one place. Celium connects route context to the plan."
      />

      <div className="flex items-center gap-4 text-sm text-slate-500">
        <span className="font-semibold text-emerald-600">Trips</span>
        <span>Packing</span>
        <span>Notes</span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {trips.map(trip => (
          <Link key={trip.id} to={`/apps/celium/plan/trips/${trip.id}`} className="card p-5 hover:border-emerald-200">
            <CardHeader
              title={trip.name}
              subtitle={trip.dates}
              action={<Badge>{trip.routes} routes</Badge>}
            />
            <p className="mt-3 text-sm text-slate-500">
              Draft itinerary with shared gear checklist and weather notes.
            </p>
          </Link>
        ))}
        <EmptyState
          className="border-dashed border-slate-300 dark:border-slate-700"
          title="Start a new trip."
          description="Create a trip from a saved route or itinerary template."
          action={<Button>Create Trip</Button>}
        />
      </div>
    </section>
  )
}

export default Plan
