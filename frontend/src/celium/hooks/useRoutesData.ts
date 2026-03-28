import { useCallback, useState } from 'react'
import { listRoutes, type RouteModel } from '@/features/api/celiumRoutes'

type UseRoutesDataArgs = {
  getAccessToken: () => Promise<string | null>
}

const useRoutesData = ({ getAccessToken }: UseRoutesDataArgs) => {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [routes, setRoutes] = useState<RouteModel[]>([])

  const loadRoutes = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const accessToken = await getAccessToken()
      const data = await listRoutes(accessToken ?? undefined)
      setRoutes(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load routes.')
    } finally {
      setIsLoading(false)
    }
  }, [getAccessToken])

  return {
    error,
    isLoading,
    loadRoutes,
    routes,
    setError,
    setRoutes,
  }
}

export default useRoutesData

