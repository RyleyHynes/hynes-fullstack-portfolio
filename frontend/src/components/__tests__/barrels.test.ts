import type { ReactNode } from 'react'

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Marker: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Popup: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  TileLayer: () => <div />,
  useMap: () => ({ fitBounds: () => undefined, flyTo: () => undefined }),
}))

vi.mock('leaflet', () => ({
  divIcon: () => ({}),
  latLngBounds: () => ({}),
}))

describe('component barrels', () => {
  it('exports shared components', async () => {
    const components = await import('@/components')

    expect(components.Button).toBeDefined()
    expect(components.IconButton).toBeDefined()
    expect(components.Input).toBeDefined()
    expect(components.Select).toBeDefined()
    expect(components.SearchBar).toBeDefined()
    expect(components.InlineFormRow).toBeDefined()
    expect(components.SectionHeader).toBeDefined()
    expect(components.PageToolbar).toBeDefined()
    expect(components.ActionBar).toBeDefined()
    expect(components.CardHeader).toBeDefined()
    expect(components.CardFooter).toBeDefined()
    expect(components.StatGrid).toBeDefined()
    expect(components.Badge).toBeDefined()
    expect(components.EmptyState).toBeDefined()
    expect(components.Tabs).toBeDefined()
    expect(components.FilterChips).toBeDefined()
    expect(components.Pagination).toBeDefined()
    expect(components.Table).toBeDefined()
    expect(components.Card).toBeDefined()
    expect(components.RouteCard).toBeDefined()
    expect(components.Avatar).toBeDefined()
    expect(components.UserChip).toBeDefined()
    expect(components.Modal).toBeDefined()
    expect(components.ModalHeader).toBeDefined()
    expect(components.ModalFooter).toBeDefined()
  })
})
