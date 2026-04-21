import Button from '@/components/buttons/Button'

type TabItem = {
  value: string
  label: string
  count?: number
}

type TabsProps = {
  items: TabItem[]
  active: string
  onChange: (value: string) => void
}

const Tabs = ({ items, active, onChange }: TabsProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500" role="tablist">
      {items.map(item => {
        const isActive = active === item.value

        return (
          <Button
            key={item.value}
            aria-selected={isActive}
            className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
              isActive
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-300/70 dark:bg-emerald-400/15 dark:text-emerald-200'
                : 'border-transparent text-slate-500 hover:border-slate-200 hover:bg-white/70 hover:text-slate-700 dark:text-slate-400 dark:hover:border-white/10 dark:hover:bg-white/5 dark:hover:text-slate-200'
            }`}
            role="tab"
            type="button"
            variant="unstyled"
            onClick={() => onChange(item.value)}
          >
            {item.label}{item.count !== undefined ? ` (${item.count})` : ''}
          </Button>
        )
      })}
    </div>
  )
}

export default Tabs
