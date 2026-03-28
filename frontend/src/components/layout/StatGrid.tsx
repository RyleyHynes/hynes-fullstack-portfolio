import { type ReactNode } from 'react'

type Stat = {
  label: ReactNode
  value: ReactNode
}

type StatGridProps = {
  stats: Stat[]
  className?: string
}

const StatGrid = ({ stats, className = '' }: StatGridProps) => {
  return (
    <div className={`grid sm:grid-cols-2 gap-4 ${className}`.trim()}>
      {stats.map(stat => (
        <div key={`${stat.label}`} className="rounded-xl border border-slate-200/70 dark:border-slate-800 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
          <p className="mt-1 font-semibold">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}

export default StatGrid
