import { type InputHTMLAttributes, type ReactNode } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  helper?: ReactNode
  error?: string
}

const Input = ({ label, helper, error, className = '', ...props }: InputProps) => {
  return (
    <label className="grid gap-2 text-xs text-slate-500">
      {label ? <span>{label}</span> : null}
      <input
        className={`rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${className} ${error ? 'border-rose-500 text-rose-700' : ''}`.trim()}
        {...props}
      />
      {helper ? <span className="text-xs text-slate-400">{helper}</span> : null}
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  )
}

export default Input
