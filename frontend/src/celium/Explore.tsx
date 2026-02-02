import { useEffect, useMemo, useRef, useState } from 'react'
import {
  createRoute,
  deleteRoute,
  listRoutes,
  updateRoute,
  type ActivityType,
  type Difficulty,
  type LoopType,
  type RouteModel,
  type RouteProgress,
  type RouteStatus,
} from '@/features/api/celiumRoutes'
import Button from '@/components/buttons/Button'
import Card from '@/components/cards/Card'
import EmptyState from '@/components/data-display/EmptyState'
import FilterChips from '@/components/data-display/FilterChips'
import { Modal, defaultRouteForm } from '@/components/modal'
import PhotoCarousel from '@/components/media/PhotoCarousel'
import PageToolbar from '@/components/layout/PageToolbar'
import RouteCard from '@/components/cards/RouteCard'
import RouteMap from '@/components/media/RouteMap'
import SearchBar from '@/components/form/SearchBar'
import SectionHeader from '@/components/layout/SectionHeader'
import Tabs from '@/components/data-display/Tabs'
import { getRoutePhotos } from '@/utils/routePhotos'
import { useAuth } from '@/auth'

const filters = ['Distance', 'Elevation', 'Difficulty', 'Landscape', 'Region']

export default function Explore() {
  const [routes, setRoutes] = useState<RouteModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(() => ({ ...defaultRouteForm }))
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [editingRoute, setEditingRoute] = useState<RouteModel | null>(null)
  const [viewingRoute, setViewingRoute] = useState<RouteModel | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editForm, setEditForm] = useState(() => ({ ...defaultRouteForm }))
  const [createPhotos, setCreatePhotos] = useState<File[]>([])
  const [routePhotos, setRoutePhotos] = useState<Record<string, File[]>>({})
  const [photoIndex, setPhotoIndex] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<RouteModel | null>(null)
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const routeRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const { isAuthenticated, login, getAccessToken } = useAuth()

  const parseCoordinate = (raw: string, kind: 'lat' | 'lng') => {
    const value = raw.trim().toUpperCase()
    if (!value) return null
    const match = value.match(/^(-?\d+(?:\.\d+)?)([NSEW])?$/)
    if (!match) return null
    let numeric = Number(match[1])
    const suffix = match[2]
    if (suffix) {
      if ((suffix === 'S' || suffix === 'W')) numeric = Math.abs(numeric) * -1
      if ((suffix === 'N' || suffix === 'E')) numeric = Math.abs(numeric)
    }
    if (kind === 'lat' && (numeric < -90 || numeric > 90)) return null
    if (kind === 'lng' && (numeric < -180 || numeric > 180)) return null
    return numeric
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'todo' | 'completed'>('all')
  const totalCount = useMemo(() => routes.length, [routes.length])
  const filteredRoutes = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase()
    if (!needle) return routes
    return routes.filter(route => {
      const activity = route.activityType.toLowerCase()
      const style = route.climbingStyle?.toLowerCase() ?? ''
      const grade = route.climbingGrade?.toLowerCase() ?? ''
      return (
        route.name.toLowerCase().includes(needle)
        || route.summary.toLowerCase().includes(needle)
        || (route.description ?? '').toLowerCase().includes(needle)
        || activity.includes(needle)
        || style.includes(needle)
        || grade.includes(needle)
      )
    })
  }, [routes, searchQuery])

  const visibleRoutes = useMemo(() => {
    if (activeTab === 'todo') {
      return filteredRoutes.filter(route => route.progress === 'Todo')
    }
    if (activeTab === 'completed') {
      return filteredRoutes.filter(route => route.progress === 'Completed')
    }
    return filteredRoutes
  }, [filteredRoutes, activeTab])

  const todoCount = useMemo(
    () => routes.filter(route => route.progress === 'Todo').length,
    [routes]
  )
  const completedCount = useMemo(
    () => routes.filter(route => route.progress === 'Completed').length,
    [routes]
  )


  const scrollToRoute = (id: string) => {
    const target = routeRefs.current[id]
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'center' })
    target.classList.add('ring-2', 'ring-emerald-300')
    window.setTimeout(() => {
      target.classList.remove('ring-2', 'ring-emerald-300')
    }, 1200)
  }

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

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude])
      },
      () => {
        setUserLocation(null)
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [])

  const handleCreate = async () => {
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
    if (form.activityType === 'RockClimbing') {
      if (!form.climbingStyle) {
        setError('Please select a climbing style.')
        return
      }
      if (form.climbingGrade.trim().length === 0) {
        setError('Please select a climbing grade.')
        return
      }
    }
    const startLat = parseCoordinate(form.startLatitude, 'lat')
    const startLng = parseCoordinate(form.startLongitude, 'lng')
    const endLat = parseCoordinate(form.endLatitude, 'lat')
    const endLng = parseCoordinate(form.endLongitude, 'lng')
    if (startLat === null || startLng === null || endLat === null || endLng === null) {
      setError('Coordinates must be valid decimal degrees or include N/S/E/W (e.g. 46.7865N, -121.7352).')
      return
    }
    setError(null)
    try {
      if (!isAuthenticated) {
        await login({ returnTo: '/apps/celium/explore' })
        return
      }
      const accessToken = await getAccessToken()
      await createRoute({
        name: form.name,
        summary: form.summary,
        description: form.description || null,
        activityType: form.activityType as ActivityType,
        climbingStyle: form.activityType === 'RockClimbing' ? (form.climbingStyle || null) : null,
        climbingGrade: form.activityType === 'RockClimbing' ? (form.climbingGrade || null) : null,
        difficulty: form.difficulty as Difficulty,
        distanceMiles: Number(form.distanceMiles),
        elevationGainFt: Number(form.elevationGainFt),
        elevationLossFt: form.elevationLossFt ? Number(form.elevationLossFt) : null,
        maxElevationFt: form.maxElevationFt ? Number(form.maxElevationFt) : null,
        minElevationFt: form.minElevationFt ? Number(form.minElevationFt) : null,
        estimatedTimeMinutes: form.estimatedTimeMinutes ? Number(form.estimatedTimeMinutes) : null,
        loopType: form.loopType as LoopType,
        startLatitude: startLat,
        startLongitude: startLng,
        endLatitude: endLat,
        endLongitude: endLng,
        status: form.status as RouteStatus,
        progress: form.progress as RouteProgress,
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      }, accessToken ?? undefined)
      setForm({ ...defaultRouteForm })
      setCreatePhotos([])
      setIsCreateOpen(false)
      setHasSubmitted(false)
      await loadRoutes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create route.')
    }
  }

  const handleDelete = async (id: string) => {
    setError(null)
    try {
      if (!isAuthenticated) {
        await login({ returnTo: '/apps/celium/explore' })
        return
      }
      const accessToken = await getAccessToken()
      await deleteRoute(id, accessToken ?? undefined)
      await loadRoutes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete route.')
    }
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return
    await handleDelete(deleteTarget.id)
    setDeleteTarget(null)
  }

  const openEdit = (route: RouteModel) => {
    setEditingRoute(route)
    setIsCreateOpen(false)
    setViewingRoute(null)
    setSelectedRouteId(route.id)
    setEditForm({
      name: route.name,
      summary: route.summary,
      description: route.description ?? '',
      activityType: route.activityType,
      climbingStyle: route.climbingStyle ?? '',
      climbingGrade: route.climbingGrade ?? '',
      difficulty: route.difficulty,
      distanceMiles: route.distanceMiles.toString(),
      elevationGainFt: route.elevationGainFt.toString(),
      elevationLossFt: route.elevationLossFt?.toString() ?? '',
      maxElevationFt: route.maxElevationFt?.toString() ?? '',
      minElevationFt: route.minElevationFt?.toString() ?? '',
      estimatedTimeMinutes: route.estimatedTimeMinutes?.toString() ?? '',
      loopType: route.loopType,
      startLatitude: route.startLatitude.toString(),
      startLongitude: route.startLongitude.toString(),
      endLatitude: route.endLatitude.toString(),
      endLongitude: route.endLongitude.toString(),
      status: route.status,
      progress: route.progress,
      publishedAt: route.publishedAt ?? '',
    })
    setPhotoIndex(0)
  }

  const openView = (route: RouteModel) => {
    setViewingRoute(route)
    setEditingRoute(null)
    setIsCreateOpen(false)
    setSelectedRouteId(route.id)
    setPhotoIndex(0)
  }

  const handleUpdate = async () => {
    if (!editingRoute) return
    setError(null)
    try {
      if (!isAuthenticated) {
        await login({ returnTo: '/apps/celium/explore' })
        return
      }
      const accessToken = await getAccessToken()
      const startLat = parseCoordinate(editForm.startLatitude, 'lat')
      const startLng = parseCoordinate(editForm.startLongitude, 'lng')
      const endLat = parseCoordinate(editForm.endLatitude, 'lat')
      const endLng = parseCoordinate(editForm.endLongitude, 'lng')
      if (startLat === null || startLng === null || endLat === null || endLng === null) {
        setError('Coordinates must be valid decimal degrees or include N/S/E/W (e.g. 46.7865N, -121.7352).')
        return
      }
      if (editForm.activityType === 'RockClimbing') {
        if (!editForm.climbingStyle) {
          setError('Please select a climbing style.')
          return
        }
        if (editForm.climbingGrade.trim().length === 0) {
          setError('Please select a climbing grade.')
          return
        }
      }
      await updateRoute(editingRoute.id, {
        name: editForm.name,
        summary: editForm.summary,
        description: editForm.description || null,
        activityType: editForm.activityType as ActivityType,
        climbingStyle: editForm.activityType === 'RockClimbing' ? (editForm.climbingStyle || null) : null,
        climbingGrade: editForm.activityType === 'RockClimbing' ? (editForm.climbingGrade || null) : null,
        difficulty: editForm.difficulty as Difficulty,
        distanceMiles: Number(editForm.distanceMiles),
        elevationGainFt: Number(editForm.elevationGainFt),
        elevationLossFt: editForm.elevationLossFt ? Number(editForm.elevationLossFt) : null,
        maxElevationFt: editForm.maxElevationFt ? Number(editForm.maxElevationFt) : null,
        minElevationFt: editForm.minElevationFt ? Number(editForm.minElevationFt) : null,
        estimatedTimeMinutes: editForm.estimatedTimeMinutes ? Number(editForm.estimatedTimeMinutes) : null,
        loopType: editForm.loopType as LoopType,
        startLatitude: startLat,
        startLongitude: startLng,
        endLatitude: endLat,
        endLongitude: endLng,
        status: editForm.status as RouteStatus,
        progress: editForm.progress as RouteProgress,
        publishedAt: editForm.publishedAt ? new Date(editForm.publishedAt).toISOString() : null,
      }, accessToken ?? undefined)
      setEditingRoute(null)
      await loadRoutes()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update route.')
    }
  }

  const handleCreateClick = () => {
    setForm({ ...defaultRouteForm })
    setCreatePhotos([])
    setHasSubmitted(false)
    setPhotoIndex(0)
    setIsCreateOpen(true)
    setEditingRoute(null)
    setViewingRoute(null)
    setSelectedRouteId(null)
  }

  return (
    <section className="grid gap-6">
      <SectionHeader
        eyebrow="Explore"
        title="Find the right route for the window you have."
        subtitle="Search across curated backcountry routes with route geometry, conditions, and trip-ready context."
      />

      <PageToolbar
        search={(
          <SearchBar
            placeholder="Search by route, description, or activity"
            value={searchQuery}
            onChange={setSearchQuery}
            label="Search routes"
          />
        )}
        filters={<FilterChips items={filters} />}
        actions={(
          <Button variant="primary" type="button" onClick={handleCreateClick}>
            Create route
          </Button>
        )}
      />

      <Tabs
        active={activeTab}
        onChange={(value) => setActiveTab(value as 'all' | 'todo' | 'completed')}
        items={[
          { value: 'all', label: 'All routes', count: totalCount },
          { value: 'todo', label: 'Todo', count: todoCount },
          { value: 'completed', label: 'Completed', count: completedCount },
        ]}
      />

      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(0,4fr)] gap-6 lg:items-start">
        <div className="grid gap-4 max-h-[70vh] overflow-y-auto pr-2">
          {isLoading ? (
            <Card className="p-4 text-sm text-slate-500">Loading routes...</Card>
          ) : null}
          {error ? (
            <Card className="p-4 text-sm text-rose-600">{error}</Card>
          ) : null}
          {!isLoading && visibleRoutes.length === 0 ? (
            <EmptyState
              title="No routes yet."
              description="Create one to get started."
              action={<Button variant="text" onClick={handleCreateClick}>Create route</Button>}
            />
          ) : null}
          {visibleRoutes.map(route => {
            const coverImage = getRoutePhotos(route.name)[0]
            return (
              <RouteCard
                key={route.id}
                ref={(el) => {
                  routeRefs.current[route.id] = el
                }}
                route={route}
                href={`/apps/celium/explore/routes/${route.id}`}
                onView={openView}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onSelect={(selected) => setSelectedRouteId(selected.id)}
                coverImage={coverImage}
              />
            )
          })}
        </div>
        <Card className="p-6 flex flex-col justify-between lg:sticky lg:top-24">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Map</p>
            <h3 className="mt-2 text-lg font-semibold">Route coverage with live overlays.</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Preview line work, conditions, and nearby objectives. Toggle access points and hazard zones.
            </p>
          </div>
          <div className="mt-6 h-[42vh] min-h-[280px] max-h-[520px] overflow-hidden rounded-2xl border border-slate-200/60 dark:border-slate-800">
            <RouteMap
              routes={visibleRoutes}
              userLocation={userLocation}
              onMarkerClick={scrollToRoute}
              selectedRouteId={selectedRouteId}
            />
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isCreateOpen || editingRoute !== null}
        onClose={() => {
          setEditingRoute(null)
          setIsCreateOpen(false)
        }}
        config={{
          variant: 'routeForm',
          mode: editingRoute ? 'edit' : 'create',
          form: editingRoute ? editForm : form,
          setForm: editingRoute ? setEditForm : setForm,
          onSubmit: editingRoute ? handleUpdate : handleCreate,
          onReset: editingRoute ? undefined : () => setForm({ ...defaultRouteForm }),
          photos: editingRoute ? (routePhotos[editingRoute.id] ?? []) : createPhotos,
          onPhotosChange: (files: File[]) => {
            if (editingRoute) {
              setRoutePhotos(current => ({ ...current, [editingRoute.id]: files }))
            } else {
              setCreatePhotos(files)
            }
            setPhotoIndex(0)
          },
          photoIndex,
          setPhotoIndex,
          showValidation: !editingRoute && hasSubmitted,
        }}
      />

      <Modal
        isOpen={viewingRoute !== null}
        onClose={() => setViewingRoute(null)}
        config={viewingRoute ? {
          title: 'View route',
          footer: <Button onClick={() => setViewingRoute(null)}>Close</Button>,
          body: (
            <div className="grid gap-4 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Summary</p>
                <p className="mt-1 text-base text-slate-900 dark:text-slate-100">{viewingRoute.summary}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>Start: {viewingRoute.startLatitude}, {viewingRoute.startLongitude}</div>
                <div>End: {viewingRoute.endLatitude}, {viewingRoute.endLongitude}</div>
                <div>Activity: {viewingRoute.activityType}</div>
                <div>Loop: {viewingRoute.loopType}</div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Photos</p>
                <PhotoCarousel
                  photos={getRoutePhotos(viewingRoute.name)}
                  index={photoIndex}
                  onPrev={() => setPhotoIndex((prev) => Math.max(prev - 1, 0))}
                  onNext={() => {
                    const count = getRoutePhotos(viewingRoute.name).length
                    if (count === 0) return
                    setPhotoIndex((prev) => Math.min(prev + 1, count - 1))
                  }}
                />
              </div>
            </div>
          ),
        } : undefined}
      />

      <Modal
        isOpen={deleteTarget !== null}
        title="Delete route?"
        onClose={() => setDeleteTarget(null)}
        footer={(
          <>
            <Button onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete route
            </Button>
          </>
        )}
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This will permanently remove <strong>{deleteTarget?.name}</strong>. This action can’t be undone.
        </p>
      </Modal>
    </section>
  )
}
