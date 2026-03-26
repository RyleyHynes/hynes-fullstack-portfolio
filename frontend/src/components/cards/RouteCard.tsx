import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import type { RouteModel } from '@/features/api/celiumRoutes'
import Badge from '@/components/data-display/Badge'
import Button from '@/components/buttons/Button'

type RouteCardProps = {
  route: RouteModel
  href: string
  onView: (route: RouteModel) => void
  onEdit?: (route: RouteModel) => void
  onDelete?: (route: RouteModel) => void
  onSelect?: (route: RouteModel) => void
  coverImage?: string | null
}

const RouteCard = forwardRef<HTMLDivElement, RouteCardProps>(
  ({ route, href, onView, onEdit, onDelete, onSelect, coverImage }, ref) => (
    <div
      ref={ref}
      className="card p-4 transition-shadow"
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onClick={() => onSelect?.(route)}
      onKeyDown={(event) => {
        if (!onSelect) return
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(route)
        }
      }}
    >
      {coverImage ? (
        <img
          src={coverImage}
          alt={`${route.name} preview`}
          className="mb-3 h-32 w-full rounded-xl object-cover"
          loading="lazy"
        />
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to={href}
            className="font-semibold hover:text-emerald-600"
            onClick={(event) => event.stopPropagation()}
          >
            {route.name}
          </Link>
          <p className="text-sm text-slate-600 dark:text-slate-300">{route.summary}</p>
          <div className="mt-2 text-xs text-slate-500 grid gap-1">
            <span>Start: {route.startLatitude}, {route.startLongitude}</span>
            <span>End: {route.endLatitude}, {route.endLongitude}</span>
            <span>
              Activity: {route.activityType}
              {route.climbingStyle ? ` (${route.climbingStyle}${route.climbingGrade ? ` ${route.climbingGrade}` : ''})` : ''} · Loop: {route.loopType}
            </span>
          </div>
        </div>
        <Badge>{route.difficulty}</Badge>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>{route.distanceMiles} mi</span>
        <span>{route.elevationGainFt} ft gain</span>
        <span className="text-slate-400">{route.status}</span>
        <Button
          variant="text"
          className="ml-auto text-xs text-emerald-600 hover:text-emerald-500"
          onClick={(event) => {
            event.stopPropagation()
            onView(route)
          }}
        >
          View
        </Button>
        {onEdit ? (
          <Button
            variant="text"
            className="text-xs text-emerald-600 hover:text-emerald-500"
            onClick={(event) => {
              event.stopPropagation()
              onEdit(route)
            }}
          >
            Edit
          </Button>
        ) : null}
        {onDelete ? (
          <Button
            variant="text"
            className="text-xs text-rose-600 hover:text-rose-500"
            onClick={(event) => {
              event.stopPropagation()
              onDelete(route)
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </div>
  )
)

RouteCard.displayName = 'RouteCard'

export default RouteCard
