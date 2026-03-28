type DualRangeSliderProps = {
  max: number
  min: number
  onChange: (range: { min: number, max: number }) => void
  step?: number
  value: { min: number, max: number }
}

const DualRangeSlider = ({ max, min, onChange, step = 1, value }: DualRangeSliderProps) => {
  const safeMin = Math.max(min, Math.min(value.min, value.max))
  const safeMax = Math.min(max, Math.max(value.max, value.min))
  const percentMin = ((safeMin - min) / Math.max(max - min, 1)) * 100
  const percentMax = ((safeMax - min) / Math.max(max - min, 1)) * 100

  return (
    <div className="relative h-8">
      <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-700" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-emerald-500"
        style={{ left: `${percentMin}%`, right: `${100 - percentMax}%` }}
      />

      <input
        className="pointer-events-none absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-emerald-600 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-emerald-600 [&::-moz-range-thumb]:bg-white [&::-moz-range-track]:bg-transparent"
        max={max}
        min={min}
        onChange={(event) => {
          const next = Number(event.target.value)
          onChange({ min: Math.min(next, safeMax), max: safeMax })
        }}
        step={step}
        type="range"
        value={safeMin}
      />
      <input
        className="pointer-events-none absolute left-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-emerald-600 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-emerald-600 [&::-moz-range-thumb]:bg-white [&::-moz-range-track]:bg-transparent"
        max={max}
        min={min}
        onChange={(event) => {
          const next = Number(event.target.value)
          onChange({ min: safeMin, max: Math.max(next, safeMin) })
        }}
        step={step}
        type="range"
        value={safeMax}
      />
    </div>
  )
}

export default DualRangeSlider

