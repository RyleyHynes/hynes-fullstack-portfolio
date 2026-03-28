import { type ReactNode, useState } from 'react'

type DropdownProps = {
  children: ReactNode
  label: string
}

const Dropdown = ({ children, label }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative z-[1200]">
      <button
        aria-expanded={isOpen}
        className="badge hover:border-emerald-300 hover:text-emerald-700 transition-colors"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        {label}
      </button>
      {isOpen ? (
        <>
          <button
            aria-label="Close dropdown"
            className="fixed inset-0 z-[1205] cursor-default"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <div className="absolute z-[1210] mt-2 min-w-72 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 shadow-xl">
            {children}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default Dropdown
