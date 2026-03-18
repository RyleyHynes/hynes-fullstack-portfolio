/**
 * External Imports
 */
import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Github, Linkedin, Mail, MapPin, Plane } from 'lucide-react'
/**
 * Internal Imports
 */
import AboutMe from '@/pages/AboutMe'
import { profile } from '@/data/profile'
import Home from '@/pages/Home'
import Career from '@/pages/Career'
import SkillsExperience from '@/pages/SkillsExperience'
import Contact from '@/pages/Contact'
import IconButton from '@/components/buttons/IconButton'
import CeliumProject from '@/pages/projects/CeliumProject'
import ComponentGallery from '@/pages/ComponentGallery'
import CeliumLayout from '@/celium/CeliumLayout'
import { RequireAuth } from '@/auth'
import ApiDocs from '@/celium/ApiDocs'
import Explore from '@/celium/Explore'
import ExploreRouteDetail from '@/celium/ExploreRouteDetail'
import Plan from '@/celium/Plan'
import PlanTripDetail from '@/celium/PlanTripDetail'
import Shop from '@/celium/Shop'
import ShopProductDetail from '@/celium/ShopProductDetail'

/**
 * Controls the Tailwind dark-mode class on the root document element.
 * @returns helpers to check or toggle the dark-mode flag.
 */
const useDarkMode = () => {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    if (enabled) root.classList.add('dark')
    else root.classList.remove('dark')
  }, [enabled])
  return { enabled, setEnabled }
}

/**
 * Shared animated wrapper that gives each route a consistent transition.
 * @param props.children content of the routed page.
 */
const Page = ({ children }: { children: React.ReactNode }) => (
  <motion.main
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ type: 'spring', stiffness: 90, damping: 16, mass: .6 }}
    className="container-padded py-10 sm:py-14"
  >
    {children}
  </motion.main>
)

/**
 * Root layout handling page routing, theme toggling, and shared chrome.
 * Animates route transitions while exposing nav links to key profile sections.
 */
const App = () => {
  const { enabled, setEnabled } = useDarkMode()
  const location = useLocation()
  const isCeliumApp = location.pathname.startsWith('/apps/celium')
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  const nav = useMemo(() => ([
    { to: '/', label: 'Home' },
    { to: '/projects/celium', label: 'Celium' },
    { to: '/career', label: 'Career' },
    { to: '/about', label: 'About Me' },
    { to: '/skills-experience', label: 'Tech Stack & Skills' },
    { to: '/contact', label: 'Contact' },
  ]), [])

  return (
    <div>
      <a href="#content" className="a11y-skiplink">Skip to content</a>
      {!isCeliumApp ? (
        <header className="sticky top-0 z-40 backdrop-blur border-b border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40">
          <div className="container-padded flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-600 text-white grid place-items-center font-bold">RH</div>
              <div className="leading-tight">
                <div className="font-bold">{profile.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{profile.title}</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              {nav.map(item => (
                <NavLink key={item.to} to={item.to} className={({isActive}) => `navlink ${isActive ? 'text-brand-600 dark:text-brand-400' : ''}`}>{item.label}</NavLink>
              ))}
            </nav>
            <div className="flex items-center gap-2">
              <IconButton
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                ariaLabel="GitHub"
                icon={<Github size={18} />}
              />
              <IconButton
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                ariaLabel="LinkedIn"
                icon={<Linkedin size={18} />}
              />
              <IconButton
                ariaLabel="Toggle dark mode"
                icon={enabled ? <Sun size={18} /> : <Moon size={18} />}
                onClick={() => setEnabled(!enabled)}
              />
            </div>
          </div>
        </header>
      ) : null}

      <AnimatePresence mode="wait">
        {isCeliumApp ? (
          <Routes location={location} key={location.pathname}>
            <Route
              path="/apps/celium"
              element={(
                <RequireAuth>
                  <CeliumLayout />
                </RequireAuth>
              )}
            >
              <Route index element={<Navigate to="/apps/celium/explore" replace />} />
              <Route path="explore" element={<Explore />} />
              <Route path="explore/routes/:routeId" element={<ExploreRouteDetail />} />
              <Route path="plan" element={<Plan />} />
              <Route path="plan/trips/:tripId" element={<PlanTripDetail />} />
              <Route path="shop" element={<Shop />} />
              <Route path="shop/products/:productId" element={<ShopProductDetail />} />
              <Route path="api-docs" element={<ApiDocs />} />
            </Route>
          </Routes>
        ) : (
          <Page key={location.pathname}>
            <div id="content" />
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Navigate to="/projects/celium" replace />} />
              <Route path="/projects/celium" element={<CeliumProject />} />
              <Route path="/ui" element={<ComponentGallery />} />
              <Route path="/career" element={<Career />} />
              <Route path="/about" element={<AboutMe />} />
              <Route path="/skills-experience" element={<SkillsExperience />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </Page>
        )}
      </AnimatePresence>

      {!isCeliumApp ? (
        <footer className="border-t border-slate-200/60 dark:border-slate-800 py-8">
          <div className="container-padded text-sm text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-300">
              <span className="flex items-center gap-2"><MapPin size={16}/>{profile.location}</span>
              <span className="flex items-center gap-1 text-xs font-semibold bg-emerald-50 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-200 px-2 py-0.5 rounded-full">
                <Plane size={12} />
                Open to relocation
              </span>
            </div>
            <div className="flex items-center gap-4">
              <a className="navlink" href={`mailto:${profile.email}`}><Mail className="inline-block mr-1" size={16}/> {profile.email}</a>
              <a className="navlink" href={profile.github} target="_blank" rel="noreferrer">GitHub</a>
              <a className="navlink" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  )
}

export default App
