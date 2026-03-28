import { type ReactNode } from 'react'

type AvatarProps = {
  initials: string
  label?: ReactNode
  className?: string
}

const Avatar = ({ initials, label, className = '' }: AvatarProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`.trim()}>
      <div className="h-9 w-9 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-200 grid place-items-center text-xs font-semibold">
        {initials}
      </div>
      {label ? <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span> : null}
    </div>
  )
}

export default Avatar
