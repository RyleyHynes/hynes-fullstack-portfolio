import { type Dispatch, type ReactNode, type SetStateAction, useEffect } from 'react'
import type {
  ActivityType,
  ClimbingStyle,
  Difficulty,
  LoopType,
  RouteProgress,
  RouteStatus,
} from '@/features/api/celiumRoutes'
import Button from '@/components/Button'
import Input from '@/components/Input'
import PhotoCarousel from '@/components/PhotoCarousel'
import Select from '@/components/Select'

type ModalConfig = {
  title?: string
  body?: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeLabel?: string
  panelClassName?: string
  bodyClassName?: string
}

export type RouteFormState = {
  name: string
  summary: string
  description: string
  activityType: ActivityType | ''
  climbingStyle: ClimbingStyle | ''
  climbingGrade: string
  difficulty: Difficulty | ''
  distanceMiles: string
  elevationGainFt: string
  elevationLossFt: string
  maxElevationFt: string
  minElevationFt: string
  estimatedTimeMinutes: string
  loopType: LoopType | ''
  startLatitude: string
  startLongitude: string
  endLatitude: string
  endLongitude: string
  status: RouteStatus | ''
  progress: RouteProgress
  publishedAt: string
}

export const defaultRouteForm: RouteFormState = {
  name: '',
  summary: '',
  description: '',
  activityType: '',
  climbingStyle: '',
  climbingGrade: '',
  difficulty: '',
  distanceMiles: '',
  elevationGainFt: '',
  elevationLossFt: '',
  maxElevationFt: '',
  minElevationFt: '',
  estimatedTimeMinutes: '',
  loopType: '',
  startLatitude: '',
  startLongitude: '',
  endLatitude: '',
  endLongitude: '',
  status: '',
  progress: 'Todo',
  publishedAt: '',
}

type RouteFormConfig = {
  variant: 'routeForm'
  mode: 'create' | 'edit'
  form: RouteFormState
  setForm: Dispatch<SetStateAction<RouteFormState>>
  onSubmit: () => void
  onReset?: () => void
  photos: File[]
  onPhotosChange: (files: File[]) => void
  photoIndex: number
  setPhotoIndex: Dispatch<SetStateAction<number>>
  showValidation: boolean
}

type ModalSmartConfig = RouteFormConfig

type ModalProps = {
  isOpen: boolean
  title?: string
  onClose: () => void
  children?: ReactNode
  footer?: ReactNode
  config?: ModalConfig | ModalSmartConfig
}

const sizeMap: Record<NonNullable<ModalConfig['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

export default function Modal({ isOpen, title, onClose, children, footer, config }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const isSmart = config && 'variant' in config
  const resolvedTitle = (!isSmart ? config?.title : undefined) ?? title
  const resolvedFooter = (!isSmart ? config?.footer : undefined) ?? footer
  const resolvedBody = (!isSmart ? config?.body : undefined) ?? children
  const panelClassName = !isSmart ? (config?.panelClassName ?? '') : ''
  const bodyClassName = !isSmart ? (config?.bodyClassName ?? '') : ''
  const sizeClassName = sizeMap[!isSmart ? (config?.size ?? 'lg') : 'lg']
  const closeLabel = (!isSmart ? config?.closeLabel : undefined) ?? 'Close'

  if (isSmart && config.variant === 'routeForm') {
    const withError = (value: string) => (config.showValidation && value.trim().length === 0 ? 'Required' : '')
    const updateField = (field: keyof RouteFormState, value: string) => {
      config.setForm(current => ({ ...current, [field]: value }))
    }

    const climbingGrades: Record<ClimbingStyle, string[]> = {
      Sport: ['5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d', '5.12a', '5.12b'],
      Trad: ['5.0', '5.1', '5.2', '5.3', '5.4', '5.5', '5.6', '5.7', '5.8', '5.9', '5.10a', '5.10b', '5.10c', '5.10d', '5.11a', '5.11b', '5.11c', '5.11d', '5.12a'],
      Bouldering: ['V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10'],
      Ice: ['WI2', 'WI3', 'WI4', 'WI5', 'WI6', 'AI2', 'AI3', 'AI4', 'AI5'],
    }

    const isEdit = config.mode === 'edit'

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative w-full max-w-3xl max-h-[80vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 px-6 py-4">
            <h3 className="text-lg font-semibold">{isEdit ? 'Edit route' : 'Create route'}</h3>
            <button className="text-sm text-slate-500 hover:text-emerald-600" onClick={onClose}>
              Close
            </button>
          </div>
          <div className="px-6 py-5 overflow-y-auto">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{isEdit ? 'Edit route' : 'Create a route'}</h3>
                <span className="text-xs text-slate-400">* required</span>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Name *"
                  value={config.form.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  placeholder="Skyline Ridge Traverse"
                  error={withError(config.form.name)}
                />
                <Input
                  label="Distance (miles) *"
                  type="number"
                  step="0.1"
                  value={config.form.distanceMiles}
                  onChange={(event) => updateField('distanceMiles', event.target.value)}
                  placeholder="8.4"
                  error={withError(config.form.distanceMiles)}
                />
                <Input
                  label="Elevation gain (ft) *"
                  type="number"
                  value={config.form.elevationGainFt}
                  onChange={(event) => updateField('elevationGainFt', event.target.value)}
                  placeholder="2200"
                  error={withError(config.form.elevationGainFt)}
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <Select
                  label="Activity type *"
                  value={config.form.activityType}
                  onChange={(event) => config.setForm(current => ({
                    ...current,
                    activityType: event.target.value as ActivityType,
                    climbingStyle: event.target.value === 'RockClimbing' ? current.climbingStyle : '',
                    climbingGrade: event.target.value === 'RockClimbing' ? current.climbingGrade : '',
                  }))}
                  options={[
                    { value: '', label: 'Please select' },
                    { value: 'Hiking', label: 'Hiking' },
                    { value: 'TrailRunning', label: 'Trail running' },
                    { value: 'RockClimbing', label: 'Rock climbing' },
                  ]}
                  error={withError(config.form.activityType)}
                />
                {config.form.activityType === 'RockClimbing' ? (
                  <Select
                    label="Climbing style"
                    value={config.form.climbingStyle}
                    onChange={(event) => config.setForm(current => ({
                      ...current,
                      climbingStyle: event.target.value as ClimbingStyle,
                      climbingGrade: '',
                    }))}
                    options={[
                      { value: '', label: 'Please select' },
                      { value: 'Sport', label: 'Sport' },
                      { value: 'Trad', label: 'Trad' },
                      { value: 'Bouldering', label: 'Bouldering' },
                      { value: 'Ice', label: 'Ice' },
                    ]}
                  />
                ) : null}
                {config.form.activityType === 'RockClimbing' && config.form.climbingStyle ? (
                  <Select
                    label="Climbing grade"
                    value={config.form.climbingGrade}
                    onChange={(event) => updateField('climbingGrade', event.target.value)}
                    options={[
                      { value: '', label: 'Please select' },
                      ...((climbingGrades[config.form.climbingStyle as ClimbingStyle] ?? [])
                        .map(grade => ({ value: grade, label: grade }))),
                    ]}
                  />
                ) : null}
                <Select
                  label="Difficulty *"
                  value={config.form.difficulty}
                  onChange={(event) => updateField('difficulty', event.target.value as Difficulty)}
                  options={[
                    { value: '', label: 'Please select' },
                    { value: 'Easy', label: 'Easy' },
                    { value: 'Moderate', label: 'Moderate' },
                    { value: 'Hard', label: 'Hard' },
                    { value: 'Expert', label: 'Expert' },
                  ]}
                  error={withError(config.form.difficulty)}
                />
                <Select
                  label="Loop type *"
                  value={config.form.loopType}
                  onChange={(event) => updateField('loopType', event.target.value as LoopType)}
                  options={[
                    { value: '', label: 'Please select' },
                    { value: 'Loop', label: 'Loop' },
                    { value: 'OutAndBack', label: 'Out and back' },
                    { value: 'PointToPoint', label: 'Point to point' },
                  ]}
                  error={withError(config.form.loopType)}
                />
                <Select
                  label="Status *"
                  value={config.form.status}
                  onChange={(event) => updateField('status', event.target.value as RouteStatus)}
                  options={[
                    { value: '', label: 'Please select' },
                    { value: 'Published', label: 'Published' },
                    { value: 'Archived', label: 'Archived' },
                  ]}
                  error={withError(config.form.status)}
                />
                <Select
                  label="Progress"
                  value={config.form.progress}
                  onChange={(event) => updateField('progress', event.target.value as RouteProgress)}
                  options={[
                    { value: 'Todo', label: 'Todo' },
                    { value: 'Completed', label: 'Completed' },
                  ]}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Start latitude *"
                  type="text"
                  value={config.form.startLatitude}
                  onChange={(event) => updateField('startLatitude', event.target.value)}
                  placeholder="46.7865N"
                  error={withError(config.form.startLatitude)}
                />
                <Input
                  label="Start longitude *"
                  type="text"
                  value={config.form.startLongitude}
                  onChange={(event) => updateField('startLongitude', event.target.value)}
                  placeholder="121.7352W"
                  error={withError(config.form.startLongitude)}
                />
                <Input
                  label="End latitude *"
                  type="text"
                  value={config.form.endLatitude}
                  onChange={(event) => updateField('endLatitude', event.target.value)}
                  placeholder="43.7904N"
                  error={withError(config.form.endLatitude)}
                />
                <Input
                  label="End longitude *"
                  type="text"
                  value={config.form.endLongitude}
                  onChange={(event) => updateField('endLongitude', event.target.value)}
                  placeholder="110.6833W"
                  error={withError(config.form.endLongitude)}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs text-slate-500">Summary *</label>
                <textarea
                  className={`rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${withError(config.form.summary) ? 'border-rose-500 text-rose-700' : ''}`}
                  rows={4}
                  value={config.form.summary}
                  onChange={(event) => updateField('summary', event.target.value)}
                  placeholder="High-alpine ridgeline with big views, strong winds, and a narrow descent. Best in stable weather windows."
                />
              </div>
              <div className="grid gap-2">
                <label className="text-xs text-slate-500">Photos</label>
                <PhotoCarousel
                  photos={config.photos}
                  index={config.photoIndex}
                  onUpload={config.onPhotosChange}
                  onPrev={() => config.setPhotoIndex((prev) => Math.max(prev - 1, 0))}
                  onNext={() => {
                    const count = config.photos.length
                    if (count === 0) return
                    config.setPhotoIndex((prev) => Math.min(prev + 1, count - 1))
                  }}
                />
              </div>
            </div>
          </div>
          <div className="border-t border-slate-200/70 dark:border-slate-800 px-6 py-4 flex justify-end gap-3">
            {isEdit ? (
              <>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="primary" onClick={config.onSubmit}>Save changes</Button>
              </>
            ) : (
              <>
                <Button onClick={config.onReset ?? onClose}>Reset</Button>
                <Button variant="primary" onClick={config.onSubmit}>Create route</Button>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizeClassName} max-h-[80vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xl flex flex-col ${panelClassName}`.trim()}>
        <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 px-6 py-4">
          <h3 className="text-lg font-semibold">{resolvedTitle}</h3>
          <button className="text-sm text-slate-500 hover:text-emerald-600" onClick={onClose}>
            {closeLabel}
          </button>
        </div>
        <div className={`px-6 py-5 overflow-y-auto ${bodyClassName}`.trim()}>{resolvedBody}</div>
        {resolvedFooter ? (
          <div className="border-t border-slate-200/70 dark:border-slate-800 px-6 py-4 flex justify-end gap-3">
            {resolvedFooter}
          </div>
        ) : null}
      </div>
    </div>
  )
}
