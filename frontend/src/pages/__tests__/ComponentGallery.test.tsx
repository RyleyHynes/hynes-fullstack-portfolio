import { render, screen } from '@testing-library/react'
import ComponentGallery from '@/pages/ComponentGallery'

describe('ComponentGallery', () => {
  it('renders gallery sections', () => {
    render(<ComponentGallery />)

    expect(screen.getByText('Component gallery')).toBeInTheDocument()
    expect(screen.getByText('Buttons')).toBeInTheDocument()
    expect(screen.getByText('Badges + stats')).toBeInTheDocument()
  })
})
