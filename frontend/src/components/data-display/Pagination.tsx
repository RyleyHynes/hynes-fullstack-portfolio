import { type ReactNode } from 'react'
import Button from '@/components/buttons/Button'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onChange?: (page: number) => void
  className?: string
  label?: ReactNode
}

const Pagination = ({ currentPage, totalPages, onChange, className = '', label }: PaginationProps) => {
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  return (
    <div className={`flex items-center gap-3 text-sm text-slate-500 ${className}`.trim()}>
      {label ? <span>{label}</span> : null}
      <Button variant="text" onClick={() => onChange?.(currentPage - 1)} disabled={!canPrev}>
        Prev
      </Button>
      <span className="text-xs text-slate-500">
        Page {currentPage} of {totalPages}
      </span>
      <Button variant="text" onClick={() => onChange?.(currentPage + 1)} disabled={!canNext}>
        Next
      </Button>
    </div>
  )
}

export default Pagination
