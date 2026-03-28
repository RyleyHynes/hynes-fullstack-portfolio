import { type ReactNode } from 'react'
import Button from '@/components/buttons/Button'

type FilterChipsProps = {
  items: string[]
  onClick?: (value: string) => void
  renderSuffix?: (value: string) => ReactNode
}

const FilterChips = ({ items, onClick, renderSuffix }: FilterChipsProps) => {
  return (
    <>
      {items.map(item => (
        <Button
          key={item}
          variant="text"
          className="badge hover:border-emerald-300 hover:text-emerald-700 transition-colors"
          onClick={() => onClick?.(item)}
          type="button"
        >
          {item}
          {renderSuffix ? renderSuffix(item) : null}
        </Button>
      ))}
    </>
  )
}

export default FilterChips
