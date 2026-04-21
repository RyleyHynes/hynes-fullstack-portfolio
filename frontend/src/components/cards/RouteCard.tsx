import { forwardRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { RouteModel } from '@/features/api/celiumRoutes'
import Badge from '@/components/data-display/Badge'
import Button from '@/components/buttons/Button'

type RouteCardProps = {
  coverImage?: string | null
  href: string
  onDelete?: (route: RouteModel) => void
  route: RouteModel
}
const RouteCard = forwardRef<HTMLDivElement, RouteCardProps>(
  ({ coverImage, href, onDelete, route }, ref) => {
    const navigate = useNavigate()
    const openRoute = () => navigate(href)

    return (
      <div
        ref={ref}
        className="card cursor-pointer p-4 transition-shadow hover:border-emerald-300"
        role="link"
        tabIndex={0}
        onClick={openRoute}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openRoute()
          }
        }}
      >
        {coverImage ? (
          <img
            alt={`${route.name} preview`}
            className="mb-3 h-32 w-full rounded-xl object-cover"
            loading="lazy"
            src={coverImage}
          />
        ) : null}
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              className="font-semibold hover:text-emerald-600"
              to={href}
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
        {onDelete ? (
          <Button
            className="ml-auto text-xs text-rose-600 hover:text-rose-500"
            variant="text"
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
  }
)

RouteCard.displayName = 'RouteCard'

export default RouteCard
