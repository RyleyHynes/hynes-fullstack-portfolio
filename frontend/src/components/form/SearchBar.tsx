import { type ChangeEvent } from 'react'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  label?: string
}

const SearchBar = ({ value, onChange, placeholder, className = '', label }: SearchBarProps) => {
  return (
    <input
      className={`rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-4 py-3 text-sm ${className}`.trim()}
      placeholder={placeholder}
      aria-label={label ?? 'Search'}
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
    />
  )
}

export default SearchBar
