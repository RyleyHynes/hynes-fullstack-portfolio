import { type ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger'
  className?: string
}

const variantClasses: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200',
}

const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${variantClasses[variant]} ${className}`.trim()}>
      {children}
    </span>
  )
}

export default Badge
