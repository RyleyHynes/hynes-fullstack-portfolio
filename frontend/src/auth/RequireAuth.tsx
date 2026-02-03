import { type ReactNode, useEffect } from 'react'
import Button from '@/components/buttons/Button'
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
  if (!isAuthenticated) {
    return (
      <div className="p-6 text-sm text-slate-500 grid gap-3">
        <span>Redirecting to login...</span>
        <Button variant="primary" onClick={() => void login({ returnTo: window.location.pathname })}>
          Sign in
        </Button>
      </div>
    )
  }

  return <>{children}</>
}
