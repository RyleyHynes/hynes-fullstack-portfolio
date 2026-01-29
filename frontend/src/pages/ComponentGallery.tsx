import { MapPin, Moon, Sun } from 'lucide-react'
import {
  ActionBar,
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  EmptyState,
  FilterChips,
  IconButton,
  Input,
  PageToolbar,
  Pagination,
  SectionHeader,
  StatGrid,
  Table,
  Tabs,
  UserChip,
} from '@/components'

const filters = ['Distance', 'Elevation', 'Difficulty']

export default function ComponentGallery() {
  return (
    <section className="grid gap-8">
      <SectionHeader
        eyebrow="UI System"
        title="Component gallery"
        subtitle="Reusable building blocks extracted from Celium and the portfolio. This view doubles as a DX sanity check."
        meta={<span>Version 0.1.0</span>}
      />

      <Card className="p-6">
        <CardHeader title="Buttons" subtitle="Primary, ghost, and icon actions." />
        <ActionBar className="mt-4">
          <Button variant="primary">Primary</Button>
          <Button>Default</Button>
          <Button variant="text">Text</Button>
          <IconButton ariaLabel="Toggle theme" icon={<Sun size={16} />} />
          <IconButton ariaLabel="Toggle theme" icon={<Moon size={16} />} />
        </ActionBar>
      </Card>

      <PageToolbar
        search={<Input placeholder="Search routes" value="" onChange={() => {}} />}
        filters={<FilterChips items={filters} />}
        actions={<Button variant="primary">Create</Button>}
      />

      <Card className="p-6">
        <CardHeader title="Badges + stats" subtitle="Status + summary patterns." />
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="danger">Danger</Badge>
        </div>
        <StatGrid
          className="mt-4"
          stats={[
            { label: 'Distance', value: '8.4 mi' },
            { label: 'Gain', value: '2200 ft' },
            { label: 'Difficulty', value: 'Moderate' },
            { label: 'Loop', value: 'Out and back' },
          ]}
        />
      </Card>

      <Card className="p-6">
        <CardHeader title="Tabs + pagination" />
        <Tabs
          active="all"
          onChange={() => {}}
          items={[
            { value: 'all', label: 'All', count: 42 },
            { value: 'todo', label: 'Todo', count: 14 },
            { value: 'completed', label: 'Completed', count: 9 },
          ]}
        />
        <Pagination className="mt-4" currentPage={1} totalPages={3} onChange={() => {}} />
      </Card>

      <Card className="p-6">
        <CardHeader title="Table" subtitle="Contracts and data display." />
        <Table
          columns={[
            { key: 'field', label: 'Field' },
            { key: 'type', label: 'Type' },
            { key: 'required', label: 'Required' },
          ]}
          rows={[
            { id: 'name', cells: { field: 'name', type: 'string', required: 'required' } },
            { id: 'distance', cells: { field: 'distanceMiles', type: 'number', required: 'optional' } },
            { id: 'status', cells: { field: 'status', type: 'Published | Archived', required: 'required' } },
          ]}
        />
      </Card>

      <Card className="p-6">
        <CardHeader title="User chips + empty state" />
        <div className="mt-4 flex flex-wrap gap-2">
          <UserChip name="Ryley Hynes" role="Owner" />
          <UserChip name="Jamie Park" role="Partner" />
          <Badge variant="success">Active</Badge>
        </div>
        <EmptyState
          className="mt-4"
          title="No routes yet."
          description="Create your first route to populate the list."
          action={<Button variant="text">Create route</Button>}
        />
      </Card>

      <Card className="p-6">
        <CardHeader title="Location" subtitle="Example of icon + text pairing." />
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <MapPin size={16} />
          <span>Seattle, WA</span>
        </div>
        <CardFooter>
          <span className="text-xs text-slate-500">Shared UI contract</span>
          <Badge variant="success">Stable</Badge>
        </CardFooter>
      </Card>
    </section>
  )
}
