type ReadinessMeterProps = {
  value: number
}

const ReadinessMeter = ({ value }: ReadinessMeterProps) => {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div className="grid gap-1">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Readiness</span>
        <span>{clamped}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all" style={{ width: `${clamped}%` }} />
      </div>
    </div>
  )
}

export default ReadinessMeter

