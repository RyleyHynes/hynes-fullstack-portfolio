import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  deleteRoute,
  getRoute,
  updateRoute,
  type ActivityType,
  type ClimbingStyle,
  type Difficulty,
  type LoopType,
  type RouteProgress,
  type RouteStatus,
  type RouteModel,
} from '@/features/api/celiumRoutes'

type RouteFormState = {
  name: string
  summary: string
  description: string
  activityType: ActivityType
  climbingStyle: ClimbingStyle | ''
  climbingGrade: string
  difficulty: Difficulty
  distanceMiles: string
  elevationGainFt: string
  elevationLossFt: string
  maxElevationFt: string
  minElevationFt: string
  estimatedTimeMinutes: string
  loopType: LoopType
  startLatitude: string
  startLongitude: string
  endLatitude: string
  endLongitude: string
  status: RouteStatus
  progress: RouteProgress
  publishedAt: string
}

export default function ExploreRouteDetail() {
  const { routeId } = useParams()
  const [route, setRoute] = useState<RouteModel | null>(null)
  const [draft, setDraft] = useState<RouteFormState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const stats = useMemo(() => ([
    { label: 'Distance', value: route ? `${route.distanceMiles} mi` : '--' },
    { label: 'Gain', value: route ? `${route.elevationGainFt} ft` : '--' },
    { label: 'Difficulty', value: route?.difficulty ?? '--' },
    { label: 'Loop', value: route?.loopType ?? '--' },
  ]), [route])

  const loadRoute = async () => {
    if (!routeId) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await getRoute(routeId)
      setRoute(data)
      setDraft({
        name: data.name,
        summary: data.summary,
        description: data.description ?? '',
        activityType: data.activityType,
        climbingStyle: data.climbingStyle ?? '',
        climbingGrade: data.climbingGrade ?? '',
        difficulty: data.difficulty,
        distanceMiles: data.distanceMiles.toString(),
        elevationGainFt: data.elevationGainFt.toString(),
        elevationLossFt: data.elevationLossFt?.toString() ?? '',
        maxElevationFt: data.maxElevationFt?.toString() ?? '',
        minElevationFt: data.minElevationFt?.toString() ?? '',
        estimatedTimeMinutes: data.estimatedTimeMinutes?.toString() ?? '',
        loopType: data.loopType,
        startLatitude: data.startLatitude.toString(),
        startLongitude: data.startLongitude.toString(),
        endLatitude: data.endLatitude.toString(),
        endLongitude: data.endLongitude.toString(),
        status: data.status,
        progress: data.progress,
        publishedAt: data.publishedAt ?? '',
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load route.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRoute()
  }, [routeId])

  const handleChange = (field: keyof RouteFormState, value: string) => {
    setDraft(current => (current ? { ...current, [field]: value } : current))
  }

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault()
    if (!routeId || !draft) return
    setError(null)
    try {
      const updated = await updateRoute(routeId, {
        name: draft.name,
        summary: draft.summary,
        description: draft.description || null,
        activityType: draft.activityType,
        climbingStyle: draft.activityType === 'RockClimbing' ? (draft.climbingStyle || null) : null,
        climbingGrade: draft.activityType === 'RockClimbing' ? (draft.climbingGrade || null) : null,
        difficulty: draft.difficulty,
        distanceMiles: Number(draft.distanceMiles),
        elevationGainFt: Number(draft.elevationGainFt),
        elevationLossFt: draft.elevationLossFt ? Number(draft.elevationLossFt) : null,
        maxElevationFt: draft.maxElevationFt ? Number(draft.maxElevationFt) : null,
        minElevationFt: draft.minElevationFt ? Number(draft.minElevationFt) : null,
        estimatedTimeMinutes: draft.estimatedTimeMinutes ? Number(draft.estimatedTimeMinutes) : null,
        loopType: draft.loopType,
        startLatitude: Number(draft.startLatitude),
        startLongitude: Number(draft.startLongitude),
        endLatitude: Number(draft.endLatitude),
        endLongitude: Number(draft.endLongitude),
        status: draft.status,
        progress: draft.progress,
        publishedAt: draft.publishedAt ? new Date(draft.publishedAt).toISOString() : null,
      })
      setRoute(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update route.')
    }
  }

  const handleDelete = async () => {
    if (!routeId) return
    setError(null)
    try {
      await deleteRoute(routeId)
      setRoute(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete route.')
    }
  }

  return (
    <section className="grid gap-6">
      <Link to="/apps/celium/explore" className="text-xs text-slate-500 hover:text-emerald-600">
        ← Back to Explore
      </Link>

      {isLoading ? (
        <div className="card p-4 text-sm text-slate-500">Loading route...</div>
      ) : null}
      {error ? (
        <div className="card p-4 text-sm text-rose-600">{error}</div>
      ) : null}
      {!isLoading && !route ? (
        <div className="card p-4 text-sm text-slate-500">Route not found.</div>
      ) : null}

      <header className="grid gap-2">
        <h1 className="text-3xl font-semibold">{route?.name ?? 'Route detail'}</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
          {route?.summary ?? 'No summary available yet.'}
        </p>
        <p className="text-xs text-slate-400">Route ID: {routeId}</p>
      </header>

      <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6">
        <div className="card p-6 grid gap-6">
          <div>
            <h2 className="text-lg font-semibold">Overview</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {route?.description || 'Add a detailed description to guide the next team on conditions and hazards.'}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {stats.map(stat => (
              <div key={stat.label} className="rounded-xl border border-slate-200/70 dark:border-slate-800 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
                <p className="mt-1 font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary">Add to Plan</button>
            <button className="btn-ghost">Suggest Edit</button>
            <button className="btn-ghost text-rose-600 hover:text-rose-500" onClick={handleDelete}>
              Delete route
            </button>
          </div>
        </div>

        <aside className="card p-6">
          <h3 className="text-sm font-semibold">Route metadata</h3>
          <ul className="mt-3 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex flex-col">
              <span className="font-medium text-slate-900 dark:text-slate-100">Activity</span>
              <span className="text-xs text-slate-500">{route?.activityType ?? '--'}</span>
            </li>
            <li className="flex flex-col">
              <span className="font-medium text-slate-900 dark:text-slate-100">Status</span>
              <span className="text-xs text-slate-500">{route?.status ?? '--'}</span>
            </li>
            <li className="flex flex-col">
              <span className="font-medium text-slate-900 dark:text-slate-100">Region</span>
              <span className="text-xs text-slate-500">{route?.regionId ?? '--'}</span>
            </li>
          </ul>
        </aside>
      </div>

      {draft ? (
        <form className="card p-6 grid gap-4" onSubmit={handleUpdate}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Update route</h3>
            <span className="text-xs text-slate-400">PUT /routes/{routeId}</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-xs text-slate-500">Name</label>
              <input
                className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                value={draft.name}
                onChange={(event) => handleChange('name', event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs text-slate-500">Summary</label>
              <input
                className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                value={draft.summary}
                onChange={(event) => handleChange('summary', event.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Description</label>
            <textarea
              className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
              rows={3}
              value={draft.description}
              onChange={(event) => handleChange('description', event.target.value)}
            />
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="grid gap-2">
              <label className="text-xs text-slate-500">Activity type</label>
              <select
                className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                value={draft.activityType}
                onChange={(event) => handleChange('activityType', event.target.value)}
              >
                <option value="Hiking">Hiking</option>
                <option value="TrailRunning">Trail running</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs text-slate-500">Difficulty</label>
              <select
                className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                value={draft.difficulty}
                onChange={(event) => handleChange('difficulty', event.target.value)}
              >
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs text-slate-500">Loop type</label>
              <select
                className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                value={draft.loopType}
                onChange={(event) => handleChange('loopType', event.target.value)}
              >
                <option value="Loop">Loop</option>
                <option value="OutAndBack">Out and back</option>
                <option value="PointToPoint">Point to point</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-xs text-slate-500">Status</label>
              <select
                className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                value={draft.status}
                onChange={(event) => handleChange('status', event.target.value)}
              >
                <option value="Published">Published</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-xs text-slate-500">Distance (miles)</label>
              <input
                className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                type="number"
                step="0.1"
                value={draft.distanceMiles}
                onChange={(event) => handleChange('distanceMiles', event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <label className="text-xs text-slate-500">Elevation gain (ft)</label>
              <input
                className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
                type="number"
                value={draft.elevationGainFt}
                onChange={(event) => handleChange('elevationGainFt', event.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-primary" type="submit">Save changes</button>
            <button className="btn-ghost" type="button" onClick={loadRoute}>Reset</button>
          </div>
        </form>
      ) : null}

      <div className="card p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Route Geometry</h3>
          <span className="text-xs text-slate-500">GeoJSON + encoded polyline</span>
        </div>
        <div className="mt-4 h-72 rounded-2xl bg-gradient-to-br from-sky-100 via-white to-emerald-100 dark:from-sky-900/40 dark:via-slate-900 dark:to-emerald-900/30 border border-slate-200/60 dark:border-slate-800" />
      </div>
    </section>
  )
}
