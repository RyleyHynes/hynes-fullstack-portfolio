import type { NoteCategory, PlanModel } from '@/celium/types/plan'

type NotesPanelProps = {
  onUpdateNotes: (category: NoteCategory, value: string) => void
  plan: PlanModel
}

const noteCategories: { key: NoteCategory, label: string }[] = [
  { key: 'TripNotes', label: 'Trip Notes' },
  { key: 'PackingNotes', label: 'Packing Notes' },
  { key: 'RisksUnknowns', label: 'Risks / Unknowns' },
  { key: 'RemainingQuestions', label: 'Remaining Questions' },
]

const NotesPanel = ({ onUpdateNotes, plan }: NotesPanelProps) => {
  return (
    <section className="card p-5 grid gap-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Notes and Uncertainty</p>
      {noteCategories.map((category) => (
        <label key={category.key} className="grid gap-2">
          <span className="text-xs text-slate-500">{category.label}</span>
          <textarea
            className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-white/5 px-3 py-2 text-sm min-h-20"
            onChange={(event) => onUpdateNotes(category.key, event.target.value)}
            placeholder={`Add ${category.label.toLowerCase()}...`}
            value={plan.notes[category.key]}
          />
        </label>
      ))}
    </section>
  )
}

export default NotesPanel

