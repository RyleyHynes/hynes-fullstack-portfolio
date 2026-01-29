import { Link, useParams } from 'react-router-dom'
import ActionBar from '@/components/layout/ActionBar'
import Badge from '@/components/data-display/Badge'
import CardHeader from '@/components/layout/CardHeader'
import SectionHeader from '@/components/layout/SectionHeader'
import UserChip from '@/components/user/UserChip'

const itinerary = [
  { day: 'Day 1', route: 'Skyline Ridge Traverse', note: 'Summit push + sunset camp' },
  { day: 'Day 2', route: 'Glass Creek Loop', note: 'Recovery loop + exit' },
]

const packing = ['Cold-weather layers', 'Water filter', 'Emergency bivy', 'Route printouts']
const participants = [
  { name: 'Ryley Hynes', role: 'Lead' },
  { name: 'Jamie Park', role: 'Partner' },
]

export default function PlanTripDetail() {
  const { tripId } = useParams()

  return (
    <section className="grid gap-6">
      <Link to="/apps/celium/plan" className="text-xs text-slate-500 hover:text-emerald-600">
        ← Back to Plan
      </Link>

      <SectionHeader
        title="October Snowline Scout"
        subtitle="Two-day itinerary built around stable pressure and an early-season snowline check."
        meta={<span>Trip ID: {tripId}</span>}
      />

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
        <div className="card p-6">
          <CardHeader
            title="Itinerary"
            action={<Badge>Draft</Badge>}
          />
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
          <CardHeader title="Packing" />
          <ul className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            {packing.map(item => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
          <ActionBar className="mt-4">
            <button className="btn-ghost">Apply Template</button>
          </ActionBar>
          <div className="mt-4 grid gap-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Participants</p>
            <div className="flex flex-wrap gap-2">
              {participants.map(participant => (
                <UserChip key={participant.name} name={participant.name} role={participant.role} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
