import { useState } from 'react'
import { defaultRouteForm, type RouteFormState } from '@/components/modal/routeForm'
import type { RouteModel } from '@/features/api/celiumRoutes'

const mapRouteToForm = (route: RouteModel): RouteFormState => ({
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

const useRouteForm = () => {
  const [createForm, setCreateForm] = useState<RouteFormState>({ ...defaultRouteForm })
  const [editForm, setEditForm] = useState<RouteFormState>({ ...defaultRouteForm })
  const [createPhotos, setCreatePhotos] = useState<File[]>([])
  const [routePhotos, setRoutePhotos] = useState<Record<string, File[]>>({})
  const [deleteTarget, setDeleteTarget] = useState<RouteModel | null>(null)
  const [editingRoute, setEditingRoute] = useState<RouteModel | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [viewingRoute, setViewingRoute] = useState<RouteModel | null>(null)

  const closeFormModal = () => {
    setEditingRoute(null)
    setIsCreateOpen(false)
  }

  const handleCreateClick = () => {
    setCreateForm({ ...defaultRouteForm })
    setCreatePhotos([])
    setHasSubmitted(false)
    setPhotoIndex(0)
    setIsCreateOpen(true)
    setEditingRoute(null)
    setViewingRoute(null)
    setSelectedRouteId(null)
  }

  const openEdit = (route: RouteModel) => {
    setEditingRoute(route)
    setIsCreateOpen(false)
    setViewingRoute(null)
    setSelectedRouteId(route.id)
    setEditForm(mapRouteToForm(route))
    setPhotoIndex(0)
  }

  const openView = (route: RouteModel) => {
    setViewingRoute(route)
    setEditingRoute(null)
    setIsCreateOpen(false)
    setSelectedRouteId(route.id)
    setPhotoIndex(0)
  }

  return {
    closeFormModal,
    createForm,
    createPhotos,
    deleteTarget,
    editForm,
    editingRoute,
    handleCreateClick,
    hasSubmitted,
    isCreateOpen,
    openEdit,
    openView,
    photoIndex,
    routePhotos,
    selectedRouteId,
    setCreateForm,
    setCreatePhotos,
    setDeleteTarget,
    setEditForm,
    setEditingRoute,
    setHasSubmitted,
    setIsCreateOpen,
    setPhotoIndex,
    setRoutePhotos,
    setSelectedRouteId,
    setViewingRoute,
    viewingRoute,
  }
}

export default useRouteForm

