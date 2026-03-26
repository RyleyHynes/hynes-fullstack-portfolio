import { render, screen } from '@testing-library/react'
import SkillsExperience from '../SkillsExperience'

describe('SkillsExperience page', () => {
  it('highlights tech stack intro', () => {
    render(<SkillsExperience />)

    expect(screen.getByRole('heading', { name: 'Tech Stack & Skills' })).toBeInTheDocument()
    expect(screen.getByText(/Full-stack engineer/i)).toBeInTheDocument()
  })

  it('renders all category cards with sample items', () => {
    render(<SkillsExperience />)

    expect(screen.getByRole('heading', { name: 'Frontend Engineering' })).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Backend & API Development' })).toBeInTheDocument()
    expect(screen.getByText('C#/.NET')).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Testing & Quality' })).toBeInTheDocument()
    expect(screen.getByText('Vitest')).toBeVisible()
    expect(screen.getByRole('heading', { name: 'DevOps & Delivery' })).toBeInTheDocument()
    expect(screen.getByText('Azure DevOps pipelines')).toBeVisible()
  })

  it('shows narrative sections for skills and highlights', () => {
    render(<SkillsExperience />)

    expect(screen.getByRole('heading', { name: /What I’m Good At/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /How I Work/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Recent Experience Highlights/i })).toBeInTheDocument()
    expect(screen.getByText(/React\/TypeScript frontends/i)).toBeInTheDocument()
  })
})
