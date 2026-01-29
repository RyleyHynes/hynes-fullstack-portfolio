import { type ReactNode } from 'react'
import Card from '@/components/cards/Card'

type EmptyStateProps = {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}

export default function EmptyState({ title, description, action, className = '' }: EmptyStateProps) {
  return (
    <Card className={`p-4 text-sm text-slate-500 ${className}`.trim()}>
      <div className="grid gap-2">
        <p className="font-semibold text-slate-700 dark:text-slate-200">{title}</p>
        {description ? <p className="text-slate-500 dark:text-slate-400">{description}</p> : null}
        {action ? <div>{action}</div> : null}
      </div>
    </Card>
  )
}
