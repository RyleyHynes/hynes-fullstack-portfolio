import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L from 'leaflet'
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

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

const defaultForm = {
  name: '',
  summary: '',
  description: '',
  activityType: '' as ActivityType | '',
  difficulty: '' as Difficulty | '',
  distanceMiles: '',
  elevationGainFt: '',
  elevationLossFt: '',
  maxElevationFt: '',
  minElevationFt: '',
  estimatedTimeMinutes: '',
  loopType: '' as LoopType | '',
  startLatitude: '',
  startLongitude: '',
  endLatitude: '',
  endLongitude: '',
  status: '' as RouteStatus | '',
  publishedAt: '',
}

export default function Explore() {
  const [routes, setRoutes] = useState<RouteModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const inputClass =
    'rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400'

  const withError = (value: string) =>
    hasSubmitted && value.trim().length === 0 ? 'border-rose-500 text-rose-700' : ''

  const totalCount = useMemo(() => routes.length, [routes.length])
  const mapCenter = useMemo(() => {
    const first = routes[0]
    if (first) {
      return [first.startLatitude, first.startLongitude] as [number, number]
    }
    return [39.7392, -104.9903] as [number, number]
  }, [routes])

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
    setHasSubmitted(true)
    const requiredFields = [
      form.name,
      form.summary,
      form.distanceMiles,
      form.elevationGainFt,
      form.activityType,
      form.difficulty,
      form.loopType,
      form.status,
      form.startLatitude,
      form.startLongitude,
      form.endLatitude,
      form.endLongitude,
    ]
    if (requiredFields.some(value => value.trim().length === 0)) {
      return
    }
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
        startLatitude: Number(form.startLatitude),
        startLongitude: Number(form.startLongitude),
        endLatitude: Number(form.endLatitude),
        endLongitude: Number(form.endLongitude),
        status: form.status,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      })
      setForm(defaultForm)
      setHasSubmitted(false)
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
          <div className="mt-6 h-64 overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <MapContainer center={mapCenter} zoom={10} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {routes.map(route => (
                <Marker
                  key={route.id}
                  position={[route.startLatitude, route.startLongitude]}
                  icon={markerIcon}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{route.name}</strong>
                      <div>{route.distanceMiles} mi · {route.elevationGainFt} ft</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      <form className="card p-6 grid gap-4" onSubmit={handleCreate}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Create a route</h3>
          <span className="text-xs text-slate-400">* required</span>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Name *</label>
            <input
              className={`${inputClass} ${withError(form.name)}`}
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              placeholder="Skyline Ridge Traverse"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Distance (miles) *</label>
            <input
              className={`${inputClass} ${withError(form.distanceMiles)}`}
              type="number"
              step="0.1"
              value={form.distanceMiles}
              onChange={(event) => handleChange('distanceMiles', event.target.value)}
              placeholder="8.4"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Elevation gain (ft) *</label>
            <input
              className={`${inputClass} ${withError(form.elevationGainFt)}`}
              type="number"
              value={form.elevationGainFt}
              onChange={(event) => handleChange('elevationGainFt', event.target.value)}
              placeholder="2200"
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Activity type *</label>
            <select
              className={`${inputClass} ${withError(form.activityType)}`}
              value={form.activityType}
              onChange={(event) => handleChange('activityType', event.target.value)}
              required
            >
              <option value="" disabled>Please select</option>
              <option value="Hiking">Hiking</option>
              <option value="TrailRunning">Trail running</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Difficulty *</label>
            <select
              className={`${inputClass} ${withError(form.difficulty)}`}
              value={form.difficulty}
              onChange={(event) => handleChange('difficulty', event.target.value)}
              required
            >
              <option value="" disabled>Please select</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Loop type *</label>
            <select
              className={`${inputClass} ${withError(form.loopType)}`}
              value={form.loopType}
              onChange={(event) => handleChange('loopType', event.target.value)}
              required
            >
              <option value="" disabled>Please select</option>
              <option value="Loop">Loop</option>
              <option value="OutAndBack">Out and back</option>
              <option value="PointToPoint">Point to point</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Status *</label>
            <select
              className={`${inputClass} ${withError(form.status)}`}
              value={form.status}
              onChange={(event) => handleChange('status', event.target.value)}
              required
            >
              <option value="" disabled>Please select</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Start latitude *</label>
            <input
              className={`${inputClass} ${withError(form.startLatitude)}`}
              type="number"
              step="0.0001"
              value={form.startLatitude}
              onChange={(event) => handleChange('startLatitude', event.target.value)}
              placeholder="39.7392"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">Start longitude *</label>
            <input
              className={`${inputClass} ${withError(form.startLongitude)}`}
              type="number"
              step="0.0001"
              value={form.startLongitude}
              onChange={(event) => handleChange('startLongitude', event.target.value)}
              placeholder="-105.0000"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">End latitude *</label>
            <input
              className={`${inputClass} ${withError(form.endLatitude)}`}
              type="number"
              step="0.0001"
              value={form.endLatitude}
              onChange={(event) => handleChange('endLatitude', event.target.value)}
              placeholder="39.8231"
              required
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xs text-slate-500">End longitude *</label>
            <input
              className={`${inputClass} ${withError(form.endLongitude)}`}
              type="number"
              step="0.0001"
              value={form.endLongitude}
              onChange={(event) => handleChange('endLongitude', event.target.value)}
              placeholder="-105.1023"
              required
            />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-xs text-slate-500">Summary *</label>
          <textarea
            className={`${inputClass} ${withError(form.summary)}`}
            rows={4}
            value={form.summary}
            onChange={(event) => handleChange('summary', event.target.value)}
            placeholder="High-alpine ridgeline with big views, strong winds, and a narrow descent. Best in stable weather windows."
            required
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
