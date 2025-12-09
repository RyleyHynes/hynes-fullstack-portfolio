import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AboutMe from '../AboutMe'

describe('AboutMe page', () => {
  it('shows base location and relocation notice', () => {
    render(<AboutMe />)

    expect(screen.getByText(/Based in/i)).toBeInTheDocument()
    expect(screen.getByText(/Willing to relocate/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Notable Summits/i })).toBeInTheDocument()
  })

  it('cycles Mount Rainier photo when pressing next then previous', () => {
    render(<AboutMe />)

    expect(screen.getByAltText('Mount Rainier trip photo 1')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Next Mount Rainier photo/i }))
    expect(screen.getByAltText('Mount Rainier trip photo 2')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Previous Mount Rainier photo/i }))
    expect(screen.getByAltText('Mount Rainier trip photo 1')).toBeInTheDocument()
  })

  it('wraps to the last photo when selecting previous from the first', () => {
    render(<AboutMe />)
    fireEvent.click(screen.getByRole('button', { name: /Previous Mount Rainier photo/i }))
    expect(screen.getByAltText('Mount Rainier trip photo 9')).toBeInTheDocument()
  })

  it('opens the modal and navigates via keyboard arrows', async () => {
    render(<AboutMe />)
    const rainierCard = screen.getByRole('button', { name: /Expand Mount Rainier photo 1/i })
    await userEvent.click(rainierCard)
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    await userEvent.keyboard('{ArrowRight}')
    expect(screen.getByAltText('Mount Rainier expanded view 2')).toBeInTheDocument()
    await userEvent.keyboard('{ArrowLeft}')
    expect(screen.getByAltText('Mount Rainier expanded view 1')).toBeInTheDocument()

    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the modal when clicking the close button', async () => {
    render(<AboutMe />)
    await userEvent.click(screen.getByRole('button', { name: /Expand Mount Rainier photo 1/i }))
    await userEvent.click(screen.getByRole('button', { name: /Close photo viewer/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the modal when clicking the backdrop', async () => {
    render(<AboutMe />)
    await userEvent.click(screen.getByRole('button', { name: /Expand Mount Rainier photo 1/i }))
    await userEvent.click(screen.getByRole('dialog'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps modal open when clicking inside content due to stopPropagation', async () => {
    render(<AboutMe />)
    await userEvent.click(screen.getByRole('button', { name: /Expand Mount Rainier photo 1/i }))
    const content = screen.getByAltText('Mount Rainier expanded view 1').parentElement as HTMLElement
    await userEvent.click(content)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('shifts photos via modal nav buttons', async () => {
    render(<AboutMe />)
    await userEvent.click(screen.getByRole('button', { name: /Expand Mount Rainier photo 1/i }))
    await userEvent.click(screen.getByRole('button', { name: /Next photo/i }))
    expect(screen.getByAltText('Mount Rainier expanded view 2')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /Previous photo/i }))
    expect(screen.getByAltText('Mount Rainier expanded view 1')).toBeInTheDocument()
  })
})
