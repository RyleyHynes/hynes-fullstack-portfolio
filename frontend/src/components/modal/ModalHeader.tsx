import { type ReactNode } from 'react'

type ModalHeaderProps = {
  title?: ReactNode
  action?: ReactNode
}

export default function ModalHeader({ title, action }: ModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-slate-800 px-6 py-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {action}
    </div>
  )
}
