import { type ReactNode } from 'react'

type ModalFooterProps = {
  children: ReactNode
}

const ModalFooter = ({ children }: ModalFooterProps) => {
  return (
    <div className="border-t border-slate-200/70 dark:border-slate-800 px-6 py-4 flex justify-end gap-3">
      {children}
    </div>
  )
}

export default ModalFooter
