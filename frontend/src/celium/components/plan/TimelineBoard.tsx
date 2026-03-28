import type { PlanModel } from '@/celium/types/plan'

type TimelineBoardProps = {
  onMoveActivity: (sourceDayId: string, sourceIndex: number, targetDayId: string, targetIndex: number) => void
  onReorderDay: (fromIndex: number, toIndex: number) => void
  onSelectActivity: (activityId: string) => void
  onSelectDay: (dayId: string) => void
  plan: PlanModel
}

const TimelineBoard = ({
  onMoveActivity,
  onReorderDay,
  onSelectActivity,
  onSelectDay,
  plan,
}: TimelineBoardProps) => {
  return (
    <div className="grid gap-4">
      {plan.days
        .slice()
        .sort((left, right) => left.order - right.order)
        .map((day, dayIndex) => (
          <section
            key={day.id}
            className="rounded-2xl border border-slate-200/70 dark:border-slate-800 p-4 grid gap-3"
            draggable
            onClick={() => onSelectDay(day.id)}
            onDragOver={(event) => event.preventDefault()}
            onDragStart={(event) => {
              event.dataTransfer.setData('application/x-day-index', String(dayIndex))
            }}
            onDrop={(event) => {
              const sourceDayIndex = Number(event.dataTransfer.getData('application/x-day-index'))
              if (!Number.isNaN(sourceDayIndex)) {
                onReorderDay(sourceDayIndex, dayIndex)
                return
              }

              const payload = event.dataTransfer.getData('application/x-activity')
              if (!payload) return
              const parsed = JSON.parse(payload) as { dayId: string, index: number }
              onMoveActivity(parsed.dayId, parsed.index, day.id, day.activities.length)
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{day.title}</p>
                {day.dateLabel ? <p className="text-xs text-slate-500 mt-1">{day.dateLabel}</p> : null}
              </div>
              <span className="text-xs text-slate-400">{day.activities.length} activities</span>
            </div>

            <div className="grid gap-2">
              {day.activities
                .slice()
                .sort((left, right) => left.order - right.order)
                .map((activity, activityIndex) => (
                  <article
                    key={activity.id}
                    className="rounded-xl border border-slate-200/70 dark:border-slate-800 px-3 py-2 cursor-move hover:border-emerald-300 transition-colors"
                    draggable
                    onClick={(event) => {
                      event.stopPropagation()
                      onSelectActivity(activity.id)
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={(event) => {
                      event.dataTransfer.setData('application/x-activity', JSON.stringify({
                        dayId: day.id,
                        index: activityIndex,
                      }))
                    }}
                    onDrop={(event) => {
                      const payload = event.dataTransfer.getData('application/x-activity')
                      if (!payload) return
                      const parsed = JSON.parse(payload) as { dayId: string, index: number }
                      onMoveActivity(parsed.dayId, parsed.index, day.id, activityIndex)
                    }}
                  >
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.type}</p>
                  </article>
                ))}
            </div>
          </section>
        ))}
    </div>
  )
}

export default TimelineBoard

