import { type ReactNode } from 'react'

type InlineFormRowProps = {
  label: ReactNode
  helper?: ReactNode
  children: ReactNode
  className?: string
}

const InlineFormRow = ({ label, helper, children, className = '' }: InlineFormRowProps) => {
  return (
    <label className={`grid gap-2 text-xs text-slate-500 ${className}`.trim()}>
      <span>{label}</span>
      {children}
      {helper ? <span className="text-xs text-slate-400">{helper}</span> : null}
    </label>
  )
}

export default InlineFormRow
