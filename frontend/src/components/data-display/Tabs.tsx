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
    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
      {items.map(item => (
        <Button
          key={item.value}
          className={`text-sm font-semibold ${active === item.value ? 'text-emerald-600' : 'text-slate-500'}`}
          type="button"
          variant="unstyled"
          onClick={() => onChange(item.value)}
        >
          {item.label}{item.count !== undefined ? ` (${item.count})` : ''}
        </Button>
      ))}
    </div>
  )
}

export default Tabs
