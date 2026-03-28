import { type ReactNode } from 'react'

type SectionHeaderProps = {
  eyebrow?: ReactNode
  title: ReactNode
  subtitle?: ReactNode
  meta?: ReactNode
  className?: string
}

const SectionHeader = ({ eyebrow, title, subtitle, meta, className = '' }: SectionHeaderProps) => {
  return (
    <header className={`grid gap-2 ${className}`.trim()}>
      {eyebrow ? <p className="text-xs uppercase tracking-[0.25em] text-emerald-600">{eyebrow}</p> : null}
      <h1 className="text-3xl font-semibold">{title}</h1>
      {subtitle ? <p className="text-slate-600 dark:text-slate-300 max-w-2xl">{subtitle}</p> : null}
      {meta ? <div className="text-xs text-slate-400">{meta}</div> : null}
    </header>
  )
}

export default SectionHeader
