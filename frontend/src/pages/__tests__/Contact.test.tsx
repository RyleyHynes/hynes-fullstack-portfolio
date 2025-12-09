import { render, screen, within } from '@testing-library/react'
import Contact from '../Contact'
import { profile } from '@/data/profile'

describe('Contact page', () => {
  it('renders supporting intro content and helper chips', () => {
    render(<Contact />)

    expect(screen.getByRole('heading', { name: 'Contact' })).toBeInTheDocument()
    expect(screen.getByText(/Ways I can help/)).toBeInTheDocument()
    expect(screen.getByText('UI engineering')).toBeVisible()
    expect(screen.getByText('API integration')).toBeVisible()
  })

  it('shows key contact links with correct targets', () => {
    render(<Contact />)

    const phoneHref = `tel:${profile.phone.replace(/[^0-9+]/g, '')}`
    expect(screen.getByRole('link', { name: profile.phone })).toHaveAttribute('href', phoneHref)
    expect(screen.getByRole('link', { name: profile.email })).toHaveAttribute('href', `mailto:${profile.email}`)
    const linkedinCard = screen.getByText('LinkedIn').closest('li') as HTMLElement
    expect(within(linkedinCard).getByRole('link', { name: /@ryleyhynes/i })).toHaveAttribute('href', profile.linkedin)
    const githubCard = screen.getByText('GitHub').closest('li') as HTMLElement
    expect(within(githubCard).getByRole('link', { name: /@RyleyHynes/i })).toHaveAttribute('href', profile.github)
  })
})
