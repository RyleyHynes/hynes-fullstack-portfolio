import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import {
  createRoute,
  deleteRoute,
  listRoutes,
  type ActivityType,
  type Difficulty,
  type LoopType,
  type RouteModel,
  type RouteStatus,
} from '@/features/api/celiumRoutes'

const filters = ['Distance', 'Elevation', 'Difficulty', 'Landscape', 'Region']

const defaultForm = {
  name: '',
  summary: '',
  description: '',
  activityType: 'Hiking' as ActivityType,
  difficulty: 'Moderate' as Difficulty,
  distanceMiles: '',
  elevationGainFt: '',
  elevationLossFt: '',
  maxElevationFt: '',
  minElevationFt: '',
  estimatedTimeMinutes: '',
  loopType: 'Loop' as LoopType,
  routeGeometry: 'LINESTRING(-105.0 39.7, -105.1 39.8)',
  startLatitude: '39.7',
  startLongitude: '-105.0',
  endLatitude: '39.8',
  endLongitude: '-105.1',
  landscapeTypeId: '00000000-0000-0000-0000-000000000001',
  regionId: '00000000-0000-0000-0000-000000000010',
  status: 'Published' as RouteStatus,
  publishedAt: '',
}

export default function Explore() {
  const [routes, setRoutes] = useState<RouteModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)

  const totalCount = useMemo(() => routes.length, [routes.length])

  const loadRoutes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listRoutes()
      setRoutes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load routes.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadRoutes()
  }, [])

  const handleChange = (field: keyof typeof defaultForm, value: string) => {
    setForm(current => ({ ...current, [field]: value }))
  }

  const handleCreate = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    try {
      await createRoute({
        name: form.name,
        summary: form.summary,
        description: form.description || null,
        activityType: form.activityType,
        difficulty: form.difficulty,
        distanceMiles: Number(form.distanceMiles),
        elevationGainFt: Number(form.elevationGainFt),
        elevationLossFt: form.elevationLossFt ? Number(form.elevationLossFt) : null,
        maxElevationFt: form.maxElevationFt ? Number(form.maxElevationFt) : null,
        minElevationFt: form.minElevationFt ? Number(form.minElevationFt) : null,
        estimatedTimeMinutes: form.estimatedTimeMinutes ? Number(form.estimatedTimeMinutes) : null,
        loopType: form.loopType,
        routeGeometry: form.routeGeometry,
        startLatitude: Number(form.startLatitude),
        startLongitude: Number(form.startLongitude),
        endLatitude: Number(form.endLatitude),
        endLongitude: Number(form.endLongitude),
        landscapeTypeId: form.landscapeTypeId,
        regionId: form.regionId,
        status: form.status,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      })
      setForm(defaultForm)
      await loadRoutes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create route.')
    }
  }

  const handleDelete = async (id: string) => {
    setError(null)
    try {
      await deleteRoute(id)
      await loadRoutes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete route.')
    }
  }

  return (
    <section className="grid gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-600">Explore</p>
        <h1 className="text-3xl font-semibold">Find the right route for the window you have.</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
          Search across curated backcountry routes with route geometry, conditions, and trip-ready context.
        </p>
      </header>

      <div className="card p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <input
            className="w-full lg:flex-1 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-4 py-3 text-sm"
            placeholder="Search by route, region, or landmark"
            aria-label="Search routes"
          />
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button key={filter} className="badge hover:border-emerald-300 hover:text-emerald-700 transition-colors">
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
        <span className="font-semibold text-emerald-600">Routes</span>
        <span>Collections</span>
        <span>Saved</span>
        <span className="text-xs text-slate-400">Total routes: {totalCount}</span>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-6">
        <div className="grid gap-4">
          {isLoading ? (
            <div className="card p-4 text-sm text-slate-500">Loading routes...</div>
          ) : null}
          {error ? (
            <div className="card p-4 text-sm text-rose-600">{error}</div>
          ) : null}
          {!isLoading && routes.length === 0 ? (
            <div className="card p-4 text-sm text-slate-500">No routes yet. Create one to get started.</div>
          ) : null}
          {routes.map(route => (
            <div key={route.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link to={`/apps/celium/explore/routes/${route.id}`} className="font-semibold hover:text-emerald-600">
                    {route.name}
                  </Link>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{route.summary}</p>
                </div>
                <span className="badge">{route.difficulty}</span>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span>{route.distanceMiles} mi</span>
                <span>{route.elevationGainFt} ft gain</span>
                <span className="text-slate-400">{route.status}</span>
                <button
                  className="ml-auto text-xs text-rose-600 hover:text-rose-500"
                  onClick={() => handleDelete(route.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="card p-6 flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Map</p>
            <h3 className="mt-2 text-lg font-semibold">Route coverage with live overlays.</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Preview line work, conditions, and nearby objectives. Toggle access points and hazard zones.
            </p>
          </div>
          <div className="mt-6 h-64 rounded-2xl bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-emerald-900/40 dark:via-slate-900 dark:to-sky-900/30 border border-slate-200/60 dark:border-slate-800" />
        </div>
      </div>

      <form className="card p-6 grid gap-4" onSubmit={handleCreate}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create a route</h3>
          <span className="text-xs text-slate-400">POST /routes</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Name</label>
            <input
              className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Summary</label>
            <input
              className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
              value={form.summary}
              onChange={(event) => handleChange('summary', event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Distance (miles)</label>
            <input
              className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
              type="number"
              step="0.1"
              value={form.distanceMiles}
              onChange={(event) => handleChange('distanceMiles', event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Elevation gain (ft)</label>
            <input
              className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
              type="number"
              value={form.elevationGainFt}
              onChange={(event) => handleChange('elevationGainFt', event.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Activity type</label>
            <select
              className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
              value={form.activityType}
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
              value={form.difficulty}
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
              value={form.loopType}
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
              value={form.status}
              onChange={(event) => handleChange('status', event.target.value)}
            >
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Start latitude</label>
            <input
              className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
              type="number"
              step="0.0001"
              value={form.startLatitude}
              onChange={(event) => handleChange('startLatitude', event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Start longitude</label>
            <input
              className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
              type="number"
              step="0.0001"
              value={form.startLongitude}
              onChange={(event) => handleChange('startLongitude', event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">End latitude</label>
            <input
              className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
              type="number"
              step="0.0001"
              value={form.endLatitude}
              onChange={(event) => handleChange('endLatitude', event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">End longitude</label>
            <input
              className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
              type="number"
              step="0.0001"
              value={form.endLongitude}
              onChange={(event) => handleChange('endLongitude', event.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Landscape type ID</label>
            <input
              className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
              value={form.landscapeTypeId}
              onChange={(event) => handleChange('landscapeTypeId', event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Region ID</label>
            <input
              className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
              value={form.regionId}
              onChange={(event) => handleChange('regionId', event.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-xs text-slate-500">Route geometry</label>
          <textarea
            className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm"
            rows={3}
            value={form.routeGeometry}
            onChange={(event) => handleChange('routeGeometry', event.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="btn-primary" type="submit">Create route</button>
          <button className="btn-ghost" type="button" onClick={() => setForm(defaultForm)}>Reset</button>
        </div>
      </form>
    </section>
  )
}
