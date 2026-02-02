import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import Modal from '@/components/modal/Modal'
import { defaultRouteForm, type RouteFormState } from '@/components/modal/routeForm'

const RouteFormHarness = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState<RouteFormState>({ ...defaultRouteForm })
  return (
    <Modal
      isOpen
      onClose={onClose}
      config={{
        variant: 'routeForm',
        mode: 'create',
        form,
        setForm,
        onSubmit: onClose,
        onReset: () => setForm({ ...defaultRouteForm }),
        photos: [],
        onPhotosChange: (files) => {
          void files
        },
        photoIndex: 0,
        setPhotoIndex: (value) => {
          void value
        },
        showValidation: true,
      }}
    />
  )
}

describe('Modal', () => {
  it('renders standard modal with config', () => {
    const onClose = vi.fn()
    render(
      <Modal
        isOpen
        onClose={onClose}
        config={{
          title: 'Details',
          body: <p>Body content</p>,
          footer: <button type="button">Close</button>,
          closeLabel: 'Dismiss',
        }}
      />
    )

    expect(screen.getByText('Details')).toBeInTheDocument()
    expect(screen.getByText('Body content')).toBeInTheDocument()
    expect(screen.getByText('Close')).toBeInTheDocument()
  })

  it('fires close on escape', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Esc" footer={<button type="button">Ok</button>} />
    )

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })

  it('renders the route form variant', () => {
    const onClose = vi.fn()
    render(<RouteFormHarness onClose={onClose} />)

    expect(screen.getByText('Create route')).toBeInTheDocument()
    expect(screen.getByLabelText('Name *')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Activity type *'), { target: { value: 'RockClimbing' } })
    expect(screen.getByLabelText('Climbing style')).toBeInTheDocument()
  })
})
