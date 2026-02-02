import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Moon, Sun, LogIn, LogOut } from 'lucide-react'
import IconButton from '@/components/buttons/IconButton'
import Button from '@/components/buttons/Button'
import { useAuth } from '@/auth'

const navItems = [
  { label: 'Explore', to: '/apps/celium/explore' },
  { label: 'Plan', to: '/apps/celium/plan' },
  { label: 'Shop', to: '/apps/celium/shop' },
]

export default function CeliumLayout() {
  const [enabled, setEnabled] = useState(document.documentElement.classList.contains('dark'))
  const { isAuthenticated, user, login, logout } = useAuth()

  const toggleTheme = () => {
    const root = document.documentElement
    const next = !enabled
    if (next) root.classList.add('dark')
    else root.classList.remove('dark')
    setEnabled(next)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 dark:border-slate-800 bg-white/85 dark:bg-slate-950/70 backdrop-blur">
        <div className="container-padded h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/apps/celium/explore" className="flex items-center gap-2">
              <span className="h-9 w-9 rounded-xl bg-emerald-600 text-white grid place-items-center font-semibold">C</span>
              <span className="text-lg font-semibold tracking-tight">Celium</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `navlink ${isActive ? 'text-emerald-600 dark:text-emerald-300' : ''}`}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && user?.name ? (
              <span className="text-xs text-slate-500">Hi, {user.name}</span>
            ) : null}
            <Link to="/apps/celium/api-docs" className="text-xs text-slate-500 hover:text-emerald-600 transition-colors">
              API Docs
            </Link>
            <Link to="/projects/celium" className="text-xs text-slate-500 hover:text-emerald-600 transition-colors">
              ← Portfolio
            </Link>
            {isAuthenticated ? (
              <Button variant="text" className="text-xs" onClick={logout}>
                <LogOut size={14} className="mr-1" /> Sign out
              </Button>
            ) : (
              <Button variant="text" className="text-xs" onClick={() => login()}>
                <LogIn size={14} className="mr-1" /> Sign in
              </Button>
            )}
            <IconButton
              ariaLabel="Toggle dark mode"
              icon={enabled ? <Sun size={16} /> : <Moon size={16} />}
              onClick={toggleTheme}
            />
          </div>
        </div>
      </header>
      <main className="container-padded py-8">
        <div id="content" />
        <Outlet />
      </main>
    </div>
  )
}
