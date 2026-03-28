import { type ReactNode, type SelectHTMLAttributes } from 'react'

type SelectOption = {
  value: string
  label: string
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string
  helper?: ReactNode
  error?: string
  options: SelectOption[]
}

const Select = ({ label, helper, error, options, className = '', ...props }: SelectProps) => {
  return (
    <label className="grid gap-2 text-xs text-slate-500">
      {label ? <span>{label}</span> : null}
      <select
        className={`rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${className} ${error ? 'border-rose-500 text-rose-700' : ''}`.trim()}
        {...props}
      >
        {options.map(option => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {helper ? <span className="text-xs text-slate-400">{helper}</span> : null}
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  )
}

export default Select
