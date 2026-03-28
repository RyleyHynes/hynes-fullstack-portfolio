import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '@/auth/AuthContext'
import Button from '@/components/buttons/Button'
import Badge from '@/components/data-display/Badge'
import CardHeader from '@/components/layout/CardHeader'
import EmptyState from '@/components/data-display/EmptyState'
import SectionHeader from '@/components/layout/SectionHeader'
import { listRoutes, type RouteModel } from '@/features/api/celiumRoutes'

const trips = [
  { id: 'oct-snowline', name: 'October Snowline Scout', dates: 'Oct 12–15', routes: 2 },
  { id: 'fall-gear-test', name: 'Fall Gear Test', dates: 'Nov 3–4', routes: 1 },
]

const Plan = () => {
  const auth = useContext(AuthContext)
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true)
  const [todoRoutes, setTodoRoutes] = useState<RouteModel[]>([])

  useEffect(() => {
    let active = true

    const loadTodoRoutes = async () => {
      try {
        const accessToken = await auth?.getAccessToken?.()
        const routes = await listRoutes(accessToken ?? undefined)
        if (!active) return
        setTodoRoutes(routes.filter((route) => route.progress === 'Todo'))
      } catch {
        if (!active) return
        setTodoRoutes([])
      } finally {
        if (active) {
          setIsLoadingRoutes(false)
        }
      }
    }

    void loadTodoRoutes()

    return () => {
      active = false
    }
  }, [auth])

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

      <div className="card p-5 grid gap-4">
        <CardHeader
          title="Routes ready to plan"
          subtitle="Any Explore route marked Todo appears here automatically."
          action={<Badge>{todoRoutes.length}</Badge>}
        />
        {isLoadingRoutes ? (
          <p className="text-sm text-slate-500">Loading todo routes...</p>
        ) : null}
        {!isLoadingRoutes && todoRoutes.length === 0 ? (
          <p className="text-sm text-slate-500">No Todo routes yet. Mark a route as Todo in Explore to plan it here.</p>
        ) : null}
        {!isLoadingRoutes ? (
          <div className="grid md:grid-cols-2 gap-3">
            {todoRoutes.map((route) => (
              <Link
                key={route.id}
                to={`/apps/celium/explore/routes/${route.id}`}
                className="rounded-xl border border-slate-200/70 dark:border-slate-800 px-4 py-3 hover:border-emerald-300 transition-colors"
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100">{route.name}</p>
                <p className="text-xs text-slate-500 mt-1">{route.distanceMiles} mi · {route.elevationGainFt} ft · {route.difficulty}</p>
              </Link>
            ))}
          </div>
        ) : null}
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
