import { render, screen, within } from '@testing-library/react'
import Career from '../Career'

describe('Career page', () => {
  it('renders primary heading and HCA experience', () => {
    render(<Career />)

    expect(screen.getByRole('heading', { name: 'Career' })).toBeInTheDocument()
    const hcaSection = screen.getByText(/HCA Healthcare/i).closest('section')
    expect(hcaSection).toBeTruthy()
    expect(within(hcaSection as HTMLElement).getByText(/Application Engineer II/)).toBeInTheDocument()
  })

  it('lists education callouts for bootcamp and UT', () => {
    render(<Career />)

    expect(screen.getByText(/Nashville Software School/i)).toBeInTheDocument()
    expect(screen.getByText(/Full-Stack Web Development Certificate/)).toBeInTheDocument()
    expect(screen.getByText(/Environmental & Soil Science/i)).toBeInTheDocument()
  })

  it('renders Tennessee state progression timeline', () => {
    render(<Career />)

    const timeline = screen.getByText(/Environmental Scientist progression/i).closest('section') as HTMLElement
    const roleHeadings = within(timeline).getAllByRole('heading', { level: 5 })
    expect(roleHeadings[0]).toHaveTextContent(/Environmental Scientist II/i)
    expect(roleHeadings[1]).toHaveTextContent(/Environmental Scientist I/i)
  })
})
