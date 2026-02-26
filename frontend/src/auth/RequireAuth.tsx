import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Button from '@/components/buttons/Button'
import { authEnabled } from './authConfig'
import { useAuth } from './AuthContext'

type RequireAuthProps = {
  children: ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { isAuthenticated, isLoading, login } = useAuth()
  const location = useLocation()

  if (!authEnabled) {
    return (
      <div className="p-6 text-sm text-rose-600 grid gap-2">
        <span>Authentication is not configured.</span>
        <span>Set `VITE_AUTH0_DOMAIN` and `VITE_AUTH0_CLIENT_ID` to launch Celium.</span>
      </div>
    )
  }
  if (isLoading) return <div className="p-6 text-sm text-slate-500">Checking session...</div>
  if (!isAuthenticated) {
    return (
      <section className="min-h-[calc(100vh-8rem)] grid place-items-center px-4 py-10">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200/70 bg-white/90 dark:bg-slate-950/70 dark:border-slate-800 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.24em] text-emerald-600">Welcome to Celium</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Sign in to continue
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Access route planning, saved progress, and collaborative updates by signing in or creating an account.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="primary"
              onClick={() => void login({ returnTo: location.pathname, mode: 'signin' })}
            >
              Sign in
            </Button>
            <Button
              variant="ghost"
              onClick={() => void login({ returnTo: location.pathname, mode: 'signup' })}
            >
              Create account
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return <>{children}</>
}
