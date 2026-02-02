import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Button from '@/components/buttons/Button'
import IconButton from '@/components/buttons/IconButton'
import Badge from '@/components/data-display/Badge'
import EmptyState from '@/components/data-display/EmptyState'
import FilterChips from '@/components/data-display/FilterChips'
import Pagination from '@/components/data-display/Pagination'
import Table from '@/components/data-display/Table'
import Tabs from '@/components/data-display/Tabs'
import Card from '@/components/cards/Card'
import RouteCard from '@/components/cards/RouteCard'
import Input from '@/components/form/Input'
import InlineFormRow from '@/components/form/InlineFormRow'
import SearchBar from '@/components/form/SearchBar'
import Select from '@/components/form/Select'
import ActionBar from '@/components/layout/ActionBar'
import CardFooter from '@/components/layout/CardFooter'
import CardHeader from '@/components/layout/CardHeader'
import PageToolbar from '@/components/layout/PageToolbar'
import SectionHeader from '@/components/layout/SectionHeader'
import StatGrid from '@/components/layout/StatGrid'
import Avatar from '@/components/user/Avatar'
import UserChip from '@/components/user/UserChip'

const sampleRoute = {
  id: 'route-1',
  name: 'Granite Ridge',
  summary: 'Big views, steady climb.',
  description: null,
  activityType: 'Hiking',
  climbingStyle: null,
  climbingGrade: null,
  difficulty: 'Moderate',
  distanceMiles: 8.6,
  elevationGainFt: 2400,
  elevationLossFt: null,
  maxElevationFt: null,
  minElevationFt: null,
  estimatedTimeMinutes: null,
  loopType: 'Loop',
  routeGeometry: '',
  startLatitude: 46.78,
  startLongitude: -121.7,
  endLatitude: 46.77,
  endLongitude: -121.69,
  landscapeTypeId: 'land',
  regionId: 'region',
  status: 'Published',
  progress: 'Todo',
}

describe('Reusable components', () => {
  it('renders layout blocks and interactions', () => {
    const onTabChange = vi.fn()
    const onFilter = vi.fn()
    const onPage = vi.fn()

    render(
      <MemoryRouter>
        <div>
          <SectionHeader
            eyebrow="Celium"
            title="Explore routes"
            subtitle="Plan your next objective."
            meta={<span>Meta</span>}
          />
          <PageToolbar
            title="Routes"
            actions={<Button>Primary</Button>}
            description="Toolbar copy"
          />
          <ActionBar title="Actions" description="Action hint">
            <Button variant="text">Secondary</Button>
          </ActionBar>
          <Card>
            <CardHeader title="Card title" subtitle="Card subtitle" />
            <div className="p-3">
              <Badge>Active</Badge>
              <EmptyState title="No data" description="Add a route." />
              <FilterChips items={['Distance', 'Region']} onClick={onFilter} renderSuffix={(item) => <span>{item}</span>} />
              <Pagination currentPage={2} totalPages={3} onChange={onPage} label="Pages" />
              <Tabs
                active="all"
                onChange={onTabChange}
                items={[
                  { value: 'all', label: 'All', count: 4 },
                  { value: 'todo', label: 'Todo', count: 2 },
                ]}
              />
            </div>
            <CardFooter>Footer</CardFooter>
          </Card>
        </div>
      </MemoryRouter>
    )

    expect(screen.getByText('Explore routes')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Todo (2)'))
    expect(onTabChange).toHaveBeenCalledWith('todo')
    fireEvent.click(screen.getByText('Distance'))
    expect(onFilter).toHaveBeenCalledWith('Distance')
    fireEvent.click(screen.getByText('Next'))
    expect(onPage).toHaveBeenCalledWith(3)
  })

  it('renders form controls and allows updates', () => {
    const onChange = vi.fn()
    render(
      <div>
        <InlineFormRow label="Field" hint="Hint">
          <Input label="Name" value="" onChange={onChange} placeholder="Name" />
        </InlineFormRow>
        <SearchBar label="Search" value="Route" onChange={onChange} />
        <Select
          label="Difficulty"
          value="Easy"
          onChange={onChange}
          options={[
            { value: 'Easy', label: 'Easy' },
            { value: 'Hard', label: 'Hard' },
          ]}
        />
      </div>
    )

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alpine' } })
    expect(onChange).toHaveBeenCalled()
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'Summit' } })
    expect(onChange).toHaveBeenCalled()
    fireEvent.change(screen.getByLabelText('Difficulty'), { target: { value: 'Hard' } })
    expect(onChange).toHaveBeenCalled()
  })

  it('renders cards and route card actions', () => {
    const onView = vi.fn()
    const onEdit = vi.fn()
    const onDelete = vi.fn()
    const onSelect = vi.fn()

    render(
      <MemoryRouter>
        <RouteCard
          route={sampleRoute}
          href="/apps/celium/explore/routes/route-1"
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onSelect={onSelect}
          coverImage="cover.jpg"
        />
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('View'))
    expect(onView).toHaveBeenCalledWith(sampleRoute)
    fireEvent.click(screen.getByText('Edit'))
    expect(onEdit).toHaveBeenCalledWith(sampleRoute)
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).toHaveBeenCalledWith(sampleRoute)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith(sampleRoute)
  })

  it('renders buttons, stats, and user chips', () => {
    render(
      <div>
        <Button variant="primary">Save</Button>
        <IconButton ariaLabel="Settings" icon={<span>Icon</span>} />
        <IconButton ariaLabel="Docs" icon={<span>Icon</span>} href="https://example.com" />
        <Avatar name="Celium User" />
        <UserChip name="Ryley" subtitle="Explorer" />
        <StatGrid
          stats={[
            { label: 'Routes', value: '12' },
            { label: 'Trips', value: '4' },
          ]}
        />
      </div>
    )

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
    expect(screen.getByLabelText('Settings')).toBeInTheDocument()
    expect(screen.getByLabelText('Docs')).toHaveAttribute('href', 'https://example.com')
    expect(screen.getByText('Ryley')).toBeInTheDocument()
  })

  it('renders tables with columns and rows', () => {
    render(
      <Table
        columns={[
          { key: 'field', label: 'Field' },
          { key: 'type', label: 'Type' },
        ]}
        rows={[
          { id: 'row-1', cells: { field: 'name', type: 'string' } },
        ]}
      />
    )

    expect(screen.getByText('Field')).toBeInTheDocument()
    expect(screen.getByText('name')).toBeInTheDocument()
  })

  it('disables pagination when on first page', () => {
    render(<Pagination currentPage={1} totalPages={1} onChange={vi.fn()} />)
    expect(screen.getByText('Prev')).toBeDisabled()
    expect(screen.getByText('Next')).toBeDisabled()
  })
})
