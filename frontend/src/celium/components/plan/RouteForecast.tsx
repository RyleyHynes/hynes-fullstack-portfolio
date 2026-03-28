import { useMemo } from 'react'
import { Cloud, CloudRain, CloudSnow, Sun } from 'lucide-react'

type ForecastCondition = 'Clear' | 'Cloudy' | 'Rain' | 'Snow'

type ForecastDay = {
  condition: ForecastCondition
  dayLabel: string
  highF: number
  lowF: number
}

type RouteForecastProps = {
  routeLabel: string
  seedKey: string
}

const FORECAST_DAYS = 7

const CONDITION_ROTATION: ForecastCondition[] = ['Clear', 'Cloudy', 'Rain', 'Clear', 'Cloudy', 'Snow', 'Clear']

const hashString = (value: string) => {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }
  return Math.abs(hash)
}

const buildMockForecast = (seedKey: string): ForecastDay[] => {
  const seed = hashString(seedKey)
  return Array.from({ length: FORECAST_DAYS }, (_, offset) => {
    const date = new Date()
    date.setDate(date.getDate() + offset)
    const baseHigh = 42 + ((seed + offset * 7) % 22)
    const lowF = Math.max(18, baseHigh - (8 + ((seed + offset) % 10)))
    return {
      condition: CONDITION_ROTATION[(seed + offset) % CONDITION_ROTATION.length],
      dayLabel: date.toLocaleDateString('en-US', { weekday: 'short' }),
      highF: baseHigh,
      lowF,
    }
  })
}

const getConditionIcon = (condition: ForecastCondition) => {
  if (condition === 'Clear') return <Sun className="h-4 w-4 text-amber-500" />
  if (condition === 'Cloudy') return <Cloud className="h-4 w-4 text-slate-500" />
  if (condition === 'Rain') return <CloudRain className="h-4 w-4 text-sky-600" />
  return <CloudSnow className="h-4 w-4 text-indigo-500" />
}

const RouteForecast = ({ routeLabel, seedKey }: RouteForecastProps) => {
  const forecast = useMemo(() => buildMockForecast(seedKey), [seedKey])

  return (
    <section className="rounded-xl border border-slate-200/70 dark:border-slate-800 p-4 grid gap-3">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Mock 7-Day Forecast</p>
        <p className="text-sm font-medium mt-1">{routeLabel}</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2">
        {forecast.map((day) => (
          <div key={day.dayLabel} className="rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 p-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">{day.dayLabel}</p>
              {getConditionIcon(day.condition)}
            </div>
            <p className="text-xs text-slate-500 mt-2">{day.condition}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              H {day.highF}F / L {day.lowF}F
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RouteForecast
