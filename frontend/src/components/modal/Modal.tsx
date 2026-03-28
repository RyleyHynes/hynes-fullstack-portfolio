import { type ReactNode, useEffect } from 'react'
import Button from '@/components/buttons/Button'
import ModalFooter from '@/components/modal/ModalFooter'
import ModalHeader from '@/components/modal/ModalHeader'

type ModalProps = {
  bodyClassName?: string
  children?: ReactNode
  closeLabel?: string
  footer?: ReactNode
  isOpen: boolean
  onClose: () => void
  panelClassName?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  title?: string
}

const sizeMap: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-3xl',
  xl: 'max-w-5xl',
}

const Modal = ({
  bodyClassName = '',
  children,
  closeLabel = 'Close',
  footer,
  isOpen,
  onClose,
  panelClassName = '',
  size = 'lg',
  title,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${sizeMap[size]} max-h-[80vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xl flex flex-col ${panelClassName}`.trim()}>
        <ModalHeader
          title={title}
          action={(
            <Button
              className="text-sm text-slate-500 hover:text-emerald-600"
              type="button"
              variant="unstyled"
              onClick={onClose}
            >
              {closeLabel}
            </Button>
          )}
        />
        <div className={`px-6 py-5 overflow-y-auto ${bodyClassName}`.trim()}>{children}</div>
        {footer ? <ModalFooter>{footer}</ModalFooter> : null}
      </div>
    </div>
  )
}

export default Modal

