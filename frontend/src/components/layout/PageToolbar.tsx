import { type ReactNode } from 'react'
import Card from '@/components/cards/Card'

type PageToolbarProps = {
  search?: ReactNode
  filters?: ReactNode
  actions?: ReactNode
  className?: string
}

const PageToolbar = ({ search, filters, actions, className = '' }: PageToolbarProps) => {
  return (
    <Card className={`p-5 ${className}`.trim()}>
      <div className="flex flex-col lg:flex-row gap-4">
        {search ? <div className="w-full lg:flex-1">{search}</div> : null}
        {filters ? <div className="flex flex-wrap gap-2">{filters}</div> : null}
        {actions ? <div className="self-start">{actions}</div> : null}
      </div>
    </Card>
  )
}

export default PageToolbar
