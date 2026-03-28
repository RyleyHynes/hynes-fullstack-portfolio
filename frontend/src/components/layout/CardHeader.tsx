import { type ReactNode } from 'react'

type CardHeaderProps = {
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
}

const CardHeader = ({ title, subtitle, action }: CardHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle ? <p className="text-sm text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  )
}

export default CardHeader
