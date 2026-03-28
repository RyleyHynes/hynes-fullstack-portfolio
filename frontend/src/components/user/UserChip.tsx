import { type ReactNode } from 'react'
import Badge from '@/components/data-display/Badge'

type UserChipProps = {
  name: string
  role?: ReactNode
}

const UserChip = ({ name, role }: UserChipProps) => {
  const initials = name.split(' ').map(part => part[0]).join('').slice(0, 2)

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200/70 dark:border-slate-800 px-3 py-1 text-sm">
      <span className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 grid place-items-center text-xs font-semibold">
        {initials}
      </span>
      <span className="text-slate-700 dark:text-slate-200">{name}</span>
      {role ? <Badge>{role}</Badge> : null}
    </div>
  )
}

export default UserChip
