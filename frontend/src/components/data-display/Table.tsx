import { type ReactNode } from 'react'

type TableColumn = {
  key: string
  label: string
  className?: string
}

type TableRow = {
  id: string
  cells: Record<string, ReactNode>
}

type TableProps = {
  columns: TableColumn[]
  rows: TableRow[]
  className?: string
}

export default function Table({ columns, rows, className = '' }: TableProps) {
  return (
    <div className={`overflow-hidden rounded-xl border border-slate-200/70 dark:border-slate-800 ${className}`.trim()}>
      <div className="grid gap-2 bg-slate-100/70 dark:bg-slate-900/60 px-3 py-2 text-[11px] uppercase tracking-wider text-slate-500">
        <div className={`grid gap-2`} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
          {columns.map(column => (
            <span key={column.key} className={column.className}>
              {column.label}
            </span>
          ))}
        </div>
      </div>
      <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
        {rows.map(row => (
          <div key={row.id} className="px-3 py-2 text-sm">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
              {columns.map(column => (
                <div key={column.key} className={column.className}>
                  {row.cells[column.key]}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
