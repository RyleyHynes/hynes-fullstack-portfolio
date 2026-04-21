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
  if (condition === 'Clear') return <Sun className="h-3.5 w-3.5 text-amber-500" />
  if (condition === 'Cloudy') return <Cloud className="h-3.5 w-3.5 text-slate-500" />
  if (condition === 'Rain') return <CloudRain className="h-3.5 w-3.5 text-sky-600" />
  return <CloudSnow className="h-3.5 w-3.5 text-indigo-500" />
}

const RouteForecast = ({ routeLabel, seedKey }: RouteForecastProps) => {
  const forecast = useMemo(() => buildMockForecast(seedKey), [seedKey])

  return (
    <section className="grid gap-2 rounded-lg bg-white/70 p-2.5 shadow-soft dark:bg-white/5">
      <div>
        <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">7-day forecast</p>
        <p className="mt-0.5 truncate text-xs text-slate-500">{routeLabel}</p>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {forecast.map((day) => (
          <div key={day.dayLabel} className="grid min-w-16 justify-items-center gap-1 rounded-md bg-slate-50 px-1.5 py-1.5 dark:bg-slate-950/60">
            <p className="text-[10px] font-semibold leading-none">{day.dayLabel.slice(0, 3)}</p>
            {getConditionIcon(day.condition)}
            <p className="text-[10px] leading-none text-slate-600 dark:text-slate-300">
              {day.highF}/{day.lowF}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default RouteForecast
