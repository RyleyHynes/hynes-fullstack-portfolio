export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const parseErrorDetail = async (response: Response) => {
  const contentType = response.headers?.get?.('content-type') || ''
  if (contentType.includes('application/json')) {
    try {
      const json = await response.json() as Record<string, unknown>
      return String(json.error ?? json.message ?? JSON.stringify(json))
    } catch {
      return `Request failed (${response.status})`
    }
  }

  const text = await response.text()
  return text || `Request failed (${response.status})`
}

export const apiRequest = async <T>(url: string, init: RequestInit = {}) => {
  const response = await fetch(url, init)
  if (!response.ok) {
    const detail = await parseErrorDetail(response)
    throw new ApiError(`${response.status} ${response.statusText}: ${detail}`, response.status)
  }

  const contentType = response.headers?.get?.('content-type') || ''
  const isDelete = init.method?.toUpperCase() === 'DELETE'
  if (response.status === 204 || isDelete) {
    return undefined as T
  }

  if (contentType.includes('application/json')) {
    return response.json() as Promise<T>
  }

  // Test mocks may omit headers even when json() exists.
  try {
    return await response.json() as T
  } catch {
    return undefined as T
  }
}
