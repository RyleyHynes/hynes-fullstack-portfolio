import { useEffect, useState } from 'react'
import { canManageRoutes } from '@/features/api/celiumRoutes'

type UseRoutePermissionsArgs = {
  getAccessToken: () => Promise<string | null>
  isAuthenticated: boolean
}

const useRoutePermissions = ({ getAccessToken, isAuthenticated }: UseRoutePermissionsArgs) => {
  const [canManage, setCanManage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      if (!isAuthenticated) {
        if (!active) return
        setCanManage(false)
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      try {
        const token = await getAccessToken()
        const allowed = await canManageRoutes(token ?? undefined)
        if (!active) return
        setCanManage(allowed)
      } catch {
        if (!active) return
        setCanManage(false)
      } finally {
        if (!active) return
        setIsLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [getAccessToken, isAuthenticated])

  return { canManage, isLoading }
}

export default useRoutePermissions

