import { render, screen, fireEvent } from '@testing-library/react'
import ApiDocs from '@/celium/ApiDocs'

const mockSpec = {
  info: { title: 'Celium API', description: 'Docs' },
  servers: [{ url: 'http://localhost:5270' }],
  paths: {
    '/routes/{id}': {
      put: {
        summary: 'Update route',
        tags: ['Routes'],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'OK' } },
      },
    },
  },
}

describe('ApiDocs', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders schema reference view', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockSpec,
    } as Response)

    render(<ApiDocs />)

    expect(await screen.findByText('Celium API')).toBeInTheDocument()
    expect(screen.getByText('Update route')).toBeInTheDocument()
    expect(screen.getByText('name')).toBeInTheDocument()
  })

  it('toggles swagger view', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockSpec,
    } as Response)

    render(<ApiDocs />)

    await screen.findByText('Celium API')
    fireEvent.click(screen.getByText('Swagger UI (read-only)'))
    expect(screen.getByTitle('Celium Swagger UI')).toBeInTheDocument()
  })

  it('shows bundled docs when the live schema is unavailable', async () => {
    const fetchMock = vi.mocked(fetch)
    fetchMock.mockRejectedValue(new Error('Failed to fetch'))

    render(<ApiDocs />)

    expect(await screen.findByText('Live API schema is unavailable. Showing the bundled Celium API reference.')).toBeInTheDocument()
    expect(screen.getByText('List routes')).toBeInTheDocument()
    expect(screen.getByText('Create route')).toBeInTheDocument()
  })
})
