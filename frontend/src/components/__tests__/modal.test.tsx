import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '@/components/modal/Modal'

describe('Modal', () => {
  it('renders standard modal', () => {
    const onClose = vi.fn()
    render(
      <Modal
        footer={<button type="button">Done</button>}
        isOpen
        onClose={onClose}
        title="Details"
      >
        <p>Body content</p>
      </Modal>
    )

    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
    expect(screen.getByText('Done')).toBeInTheDocument()
  })

  it('fires close on escape', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Esc" footer={<button type="button">Ok</button>} />
    )

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

})
