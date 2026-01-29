import { useEffect, useMemo, useState } from 'react'
import Card from '@/components/cards/Card'
import Button from '@/components/buttons/Button'
import SectionHeader from '@/components/layout/SectionHeader'
import Table from '@/components/data-display/Table'

type ApiSpec = {
  info?: {
    title?: string
    version?: string
    description?: string
  }
  servers?: Array<{ url: string }>
  paths?: Record<string, Record<string, ApiOperation>>
  components?: {
    schemas?: Record<string, ApiSchema>
  }
}

type ApiSchema = {
  type?: string
  format?: string
  enum?: string[]
  items?: ApiSchema
  properties?: Record<string, ApiSchema>
  required?: string[]
  $ref?: string
}

type ApiOperation = {
  summary?: string
  description?: string
  tags?: string[]
  parameters?: Array<{
    name: string
    in: string
    required?: boolean
    schema?: ApiSchema
  }>
  requestBody?: {
    content?: Record<string, { schema?: ApiSchema }>
  }
  responses?: Record<string, { description?: string }>
}

const resolveBaseUrl = () => (
  import.meta.env.VITE_CELIUM_API_URL
    ?? (import.meta.env.PROD ? '/api/celium' : 'http://localhost:5270')
)

const methodStyles: Record<string, string> = {
  get: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-200',
  post: 'bg-sky-500/10 text-sky-700 dark:text-sky-200',
  put: 'bg-amber-500/10 text-amber-700 dark:text-amber-200',
  delete: 'bg-rose-500/10 text-rose-700 dark:text-rose-200',
  patch: 'bg-purple-500/10 text-purple-700 dark:text-purple-200',
}

const resolveSchema = (schema: ApiSchema | undefined, spec?: ApiSpec): ApiSchema | undefined => {
  if (!schema) return undefined
  if (!schema.$ref) return schema
  const ref = schema.$ref.replace('#/components/schemas/', '')
  return spec?.components?.schemas?.[ref]
}

const formatSchema = (schema: ApiSchema | undefined, spec?: ApiSpec): string => {
  const resolved = resolveSchema(schema, spec)
  if (!resolved) return 'Unknown'
  if (resolved.enum?.length) return resolved.enum.join(' | ')
  if (resolved.type === 'array' && resolved.items) return `Array<${formatSchema(resolved.items, spec)}>`
  if (resolved.type && resolved.format) return `${resolved.type} (${resolved.format})`
  return resolved.type ?? 'object'
}

const buildSchemaRows = (schema: ApiSchema | undefined, spec?: ApiSpec) => {
  const resolved = resolveSchema(schema, spec)
  const properties = resolved?.properties ?? {}
  const required = new Set(resolved?.required ?? [])
  return Object.entries(properties).map(([key, value]) => ({
    key,
    type: formatSchema(value, spec),
    required: required.has(key),
  }))
}

export default function ApiDocs() {
  const [spec, setSpec] = useState<ApiSpec | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showSwagger, setShowSwagger] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${resolveBaseUrl()}/swagger/v1/swagger.json`)
        if (!response.ok) {
          throw new Error('Unable to load API schema.')
        }
        const data = await response.json()
        setSpec(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load API schema.')
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const grouped = useMemo(() => {
    if (!spec?.paths) return []
    const groups: Record<string, Array<{ path: string; method: string; op: ApiOperation }>> = {}
    Object.entries(spec.paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, op]) => {
        const tag = op.tags?.[0] ?? 'General'
        if (!groups[tag]) groups[tag] = []
        groups[tag].push({ path, method, op })
      })
    })
    return Object.entries(groups).map(([tag, items]) => ({
      tag,
      items: items.sort((a, b) => a.path.localeCompare(b.path)),
    }))
  }, [spec])

  const baseUrl = spec?.servers?.[0]?.url ?? resolveBaseUrl()

  return (
    <section className="grid gap-6">
      <SectionHeader
        eyebrow="API Docs"
        title={spec?.info?.title ?? 'Celium API'}
        subtitle={spec?.info?.description ?? 'Reference for every endpoint, payload, and response shape in Celium.'}
        meta={<span>Base URL: <span className="font-mono">{baseUrl}</span></span>}
      />
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="text" onClick={() => setShowSwagger(false)}>
          Reference view
        </Button>
        <Button variant="text" onClick={() => setShowSwagger(true)}>
          Swagger UI (read-only)
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-4 text-sm text-slate-500">Loading API schema...</Card>
      ) : null}
      {error ? (
        <Card className="p-4 text-sm text-rose-600">{error}</Card>
      ) : null}

      {showSwagger ? (
        <Card className="p-0 overflow-hidden">
          <iframe
            title="Celium Swagger UI"
            src={`${resolveBaseUrl()}/swagger/index.html`}
            className="w-full h-[80vh] border-0"
          />
        </Card>
      ) : null}

      {!showSwagger ? grouped.map(group => (
        <div key={group.tag} className="grid gap-4">
          <h2 className="text-lg font-semibold">{group.tag}</h2>
          <div className="grid gap-4">
            {group.items.map(({ path, method, op }) => (
              <Card key={`${method}-${path}`} className="p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${methodStyles[method] ?? 'bg-slate-500/10 text-slate-700 dark:text-slate-200'}`}>
                    {method}
                  </span>
                  <span className="font-mono text-sm">{path}</span>
                  {op.summary ? <span className="text-sm text-slate-600 dark:text-slate-300">{op.summary}</span> : null}
                </div>
                {op.description ? (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{op.description}</p>
                ) : null}

                {op.parameters?.length ? (
                  <div className="mt-4 text-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Parameters</p>
                    <div className="mt-2">
                      <Table
                        columns={[
                          { key: 'field', label: 'Field' },
                          { key: 'type', label: 'Type' },
                          { key: 'required', label: 'Required' },
                        ]}
                        rows={op.parameters.map(param => ({
                          id: `${param.in}-${param.name}`,
                          cells: {
                            field: (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono">{param.name}</span>
                                <span className="text-[11px] uppercase tracking-wide text-slate-400">{param.in}</span>
                              </div>
                            ),
                            type: <span className="text-xs text-slate-500">{formatSchema(param.schema, spec ?? undefined)}</span>,
                            required: <span className="text-xs text-slate-500">{param.required ? 'required' : 'optional'}</span>,
                          },
                        }))}
                      />
                    </div>
                  </div>
                ) : null}

                {op.requestBody?.content?.['application/json']?.schema ? (
                  <div className="mt-4 text-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Request Body</p>
                    {buildSchemaRows(op.requestBody.content['application/json'].schema, spec ?? undefined).length ? (
                      <div className="mt-2">
                        <Table
                          columns={[
                            { key: 'field', label: 'Field' },
                            { key: 'type', label: 'Type' },
                            { key: 'required', label: 'Required' },
                          ]}
                          rows={buildSchemaRows(op.requestBody.content['application/json'].schema, spec ?? undefined).map(row => ({
                            id: row.key,
                            cells: {
                              field: <span className="font-mono">{row.key}</span>,
                              type: <span className="text-xs text-slate-500">{row.type}</span>,
                              required: <span className="text-xs text-slate-500">{row.required ? 'required' : 'optional'}</span>,
                            },
                          }))}
                        />
                      </div>
                    ) : (
                      <pre className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-950/90 text-slate-100 p-3 text-xs">
                        {JSON.stringify(resolveSchema(op.requestBody.content['application/json'].schema, spec ?? undefined), null, 2)}
                      </pre>
                    )}
                  </div>
                ) : null}

                {op.responses ? (
                  <div className="mt-4 text-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Responses</p>
                    <div className="mt-2 grid gap-1 text-xs text-slate-500">
                      {Object.entries(op.responses).map(([code, response]) => (
                        <div key={code} className="flex items-center gap-2">
                          <span className="font-mono">{code}</span>
                          <span>{response?.description ?? 'Response'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      )) : null}
    </section>
  )
}
