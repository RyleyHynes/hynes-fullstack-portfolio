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

export default function Tabs({ items, active, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
      {items.map(item => (
        <button
          key={item.value}
          className={`text-sm font-semibold ${active === item.value ? 'text-emerald-600' : 'text-slate-500'}`}
          onClick={() => onChange(item.value)}
          type="button"
        >
          {item.label}{item.count !== undefined ? ` (${item.count})` : ''}
        </button>
      ))}
    </div>
  )
}
