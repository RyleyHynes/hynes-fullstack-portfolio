import { type ReactNode, useEffect } from 'react'
import { authEnabled } from './authConfig'
import { useAuth } from './AuthContext'

type RequireAuthProps = {
  children: ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading, login } = useAuth()

  useEffect(() => {
    if (!authEnabled || isLoading || isAuthenticated) return
    void login()
  }, [isAuthenticated, isLoading, login])

  if (!authEnabled) return <>{children}</>
  if (isLoading) return <div className="p-6 text-sm text-slate-500">Checking session...</div>
  if (!isAuthenticated) return <div className="p-6 text-sm text-slate-500">Redirecting to login...</div>

  return <>{children}</>
}
