import { projects } from '@/data/profile'

describe('profile data', () => {
  it('includes Celium project data', () => {
    const celium = projects.find(project => project.name === 'Celium')
    expect(celium).toBeDefined()
    expect(celium?.blurb).toBeTruthy()
  })
})
