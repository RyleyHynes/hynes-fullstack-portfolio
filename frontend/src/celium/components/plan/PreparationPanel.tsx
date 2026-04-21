import { type DragEvent, type KeyboardEvent, useState } from 'react'
import Button from '@/components/buttons/Button'
import Modal from '@/components/modal/Modal'
import type { ChecklistItem, ChecklistStatus, PlanModel } from '@/celium/types/plan'

type PreparationPanelProps = {
  onCreateTask: (label: string) => void
  onSetStatus: (itemId: string, status: ChecklistStatus) => void
  onUpdateTask: (itemId: string, updates: { description?: string, label: string }) => void
  plan: PlanModel
}

const statusColumns: Array<{ label: string, status: ChecklistStatus }> = [
  { label: 'To Do', status: 'NotStarted' },
  { label: 'In Progress', status: 'InProgress' },
  { label: 'Completed', status: 'Done' },
]

const PreparationPanel = ({ onCreateTask, onSetStatus, onUpdateTask, plan }: PreparationPanelProps) => {
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null)
  const [editedDescription, setEditedDescription] = useState('')
  const [editedTitle, setEditedTitle] = useState('')
  const [isEditingTask, setIsEditingTask] = useState(false)
  const [newTaskLabel, setNewTaskLabel] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const selectedTask = plan.checklistItems.find((item) => item.id === selectedTaskId) ?? null

  const handleCreateTask = () => {
    const label = newTaskLabel.trim()
    if (!label) return
    onCreateTask(label)
    setNewTaskLabel('')
  }

  const handleDragStart = (event: DragEvent<HTMLDivElement>, itemId: string) => {
    setDraggedItemId(itemId)
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', itemId)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>, status: ChecklistStatus) => {
    event.preventDefault()
    const itemId = event.dataTransfer.getData('text/plain') || draggedItemId
    if (!itemId) return
    onSetStatus(itemId, status)
    setDraggedItemId(null)
  }

  const handleTaskKeyDown = (event: KeyboardEvent<HTMLDivElement>, item: ChecklistItem) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openTask(item)
    }
  }

  const handleUpdateTask = () => {
    if (!selectedTask) return
    const label = editedTitle.trim()
    if (!label) return
    onUpdateTask(selectedTask.id, {
      description: editedDescription.trim(),
      label,
    })
    setIsEditingTask(false)
  }

  const openTask = (item: ChecklistItem) => {
    setEditedDescription(item.description ?? '')
    setEditedTitle(item.label)
    setIsEditingTask(false)
    setSelectedTaskId(item.id)
  }

  return (
    <>
      <section className="card p-5 grid gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Preparation tasks</p>
            <p className="mt-1 text-sm text-slate-500">Track the work needed before this trip is ready.</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row md:max-w-md">
            <label className="sr-only" htmlFor="new-preparation-task">New preparation task</label>
            <input
              className="min-w-0 flex-1 rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2 text-sm dark:border-slate-800 dark:bg-white/5"
              id="new-preparation-task"
              placeholder="New preparation task"
              value={newTaskLabel}
              onChange={(event) => setNewTaskLabel(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleCreateTask()
                }
              }}
            />
            <Button type="button" variant="primary" onClick={handleCreateTask}>
              Add task
            </Button>
          </div>
        </div>

        <div className="grid min-w-0 gap-4 xl:grid-cols-3">
          {statusColumns.map((column) => {
            const items = plan.checklistItems.filter((item) => item.status === column.status)

            return (
              <div
                key={column.status}
                className="grid h-[32rem] min-w-0 grid-rows-[auto_minmax(0,1fr)] gap-3 overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-white/5"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => handleDrop(event, column.status)}
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{column.label}</h3>
                  <span className="badge">{items.length}</span>
                </div>

                <div className="grid min-h-0 min-w-0 content-start gap-3 overflow-x-hidden overflow-y-auto pr-1">
                  {items.length ? items.map((item) => (
                    <div
                      key={item.id}
                      className="grid min-w-0 cursor-grab gap-2 overflow-hidden rounded-lg border border-slate-200/80 bg-white p-3 text-left shadow-sm outline-none transition hover:border-emerald-300 focus-visible:ring-2 focus-visible:ring-emerald-400 active:cursor-grabbing dark:border-white/10 dark:bg-slate-950/60"
                      draggable
                      role="button"
                      tabIndex={0}
                      onClick={() => openTask(item)}
                      onDragEnd={() => setDraggedItemId(null)}
                      onDragStart={(event) => handleDragStart(event, item.id)}
                      onKeyDown={(event) => handleTaskKeyDown(event, item)}
                    >
                      <p className="break-words text-sm font-medium">{item.label}</p>
                      <p className="line-clamp-2 text-xs text-slate-500">
                        {item.description || 'No description yet.'}
                      </p>
                      <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                        <span className="min-w-0 break-words text-xs text-slate-400">{item.category}</span>
                        <select
                          aria-label={`Move ${item.label}`}
                          className="max-w-full rounded-md border border-slate-200/80 bg-white px-2 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                          value={item.status}
                          onChange={(event) => {
                            event.stopPropagation()
                            onSetStatus(item.id, event.target.value as ChecklistStatus)
                          }}
                          onClick={(event) => event.stopPropagation()}
                        >
                          {statusColumns.map((option) => (
                            <option key={option.status} value={option.status}>{option.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )) : (
                    <p className="rounded-lg border border-dashed border-slate-200/80 px-3 py-6 text-center text-sm text-slate-400 dark:border-white/10">
                      Drop tasks here
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <Modal
        footer={(
          <>
            {isEditingTask ? (
              <Button type="button" variant="ghost" onClick={() => setIsEditingTask(false)}>
                Cancel
              </Button>
            ) : null}
            <Button
              type="button"
              variant={isEditingTask ? 'primary' : 'ghost'}
              onClick={isEditingTask ? handleUpdateTask : () => setIsEditingTask(true)}
            >
              {isEditingTask ? 'Save changes' : 'Edit'}
            </Button>
          </>
        )}
        isOpen={Boolean(selectedTask)}
        size="md"
        title={selectedTask?.label ?? 'Preparation task'}
        onClose={() => setSelectedTaskId(null)}
      >
        {selectedTask ? (
          <div className="grid gap-4">
            {isEditingTask ? (
              <>
                <label className="grid gap-2">
                  <span className="text-xs text-slate-500">Title</span>
                  <input
                    className="rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2 text-sm dark:border-slate-800 dark:bg-white/5"
                    value={editedTitle}
                    onChange={(event) => setEditedTitle(event.target.value)}
                  />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs text-slate-500">Description</span>
                  <textarea
                    className="min-h-32 rounded-xl border border-slate-200/70 bg-white/80 px-3 py-2 text-sm dark:border-slate-800 dark:bg-white/5"
                    placeholder="Add task details, dependencies, or acceptance criteria."
                    value={editedDescription}
                    onChange={(event) => setEditedDescription(event.target.value)}
                  />
                </label>
              </>
            ) : (
              <>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Title</p>
                  <p className="mt-1 text-lg font-semibold">{selectedTask.label}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Description</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">
                    {selectedTask.description || 'No description yet.'}
                  </p>
                </div>
              </>
            )}
          </div>
        ) : null}
      </Modal>
    </>
  )
}

export default PreparationPanel
