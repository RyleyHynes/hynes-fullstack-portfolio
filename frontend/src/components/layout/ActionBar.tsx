import { type ReactNode } from 'react'

type ActionBarProps = {
  children: ReactNode
  className?: string
}

export default function ActionBar({ children, className = '' }: ActionBarProps) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`.trim()}>
      {children}
    </div>
  )
}
