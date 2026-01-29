import { type ReactNode } from 'react'

type CardFooterProps = {
  children: ReactNode
  className?: string
}

export default function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`mt-4 flex items-center justify-between gap-3 ${className}`.trim()}>
      {children}
    </div>
  )
}
