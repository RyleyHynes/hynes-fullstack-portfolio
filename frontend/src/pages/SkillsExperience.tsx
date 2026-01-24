import type { ComponentType } from 'react'
import { skills } from '@/data/profile'
import { Code, Server, ShieldCheck, Rocket } from 'lucide-react'

/**
 * Small badge element used for tech stack tokens.
 */
function Pill({ children }: { children: React.ReactNode }) {
  return <span className="badge">{children}</span>
}

/**
 * Skills page outlining tooling, practices, and experience highlights.
 */
export default function SkillsExperience() {
  const categories = [
    {
      title: 'Frontend Engineering',
      icon: Code,
      accent: 'from-emerald-50 via-white to-emerald-50 dark:from-green-500/10 dark:via-slate-950 dark:to-green-500/5',
      sections: [
        { label: 'Technologies', items: ['TypeScript', 'React', 'Redux', 'RTK Query', 'React Router', 'HTML5', 'CSS3', 'SCSS', 'Tailwind', 'Bootstrap'] },
        { label: 'Practices', items: ['Accessible UI (WCAG)', 'Component systems', 'State management', 'Responsive layouts'], plain: true },
        { label: 'Tools', items: ['Figma', 'Neutron DS', 'Chrome DevTools'] },
      ],
    },
    {
      title: 'Backend & API Development',
      icon: Server,
      accent: 'from-sky-50 via-white to-sky-50 dark:from-sky-500/10 dark:via-slate-950 dark:to-sky-500/5',
      sections: [
        { label: 'Languages & Frameworks', items: ['C#/.NET', 'Python/Django'] },
        { label: 'Databases', items: ['SQL Server', 'Cosmos DB', 'Firebase'] },
        { label: 'API Work', items: ['REST design', 'Swagger/OpenAPI', 'Auth & authorization', 'API versioning', 'Postman diagnostics'], plain: true },
        { label: 'Patterns', items: ['Repository pattern', 'Dependency injection', 'Async workflows'], plain: true },
      ],
    },
    {
      title: 'Testing & Quality',
      icon: ShieldCheck,
      accent: 'from-purple-50 via-white to-purple-50 dark:from-purple-500/10 dark:via-slate-950 dark:to-purple-500/5',
      sections: [
        { label: 'Tools & Skills', items: ['Vitest', 'Pytest'] },
        { label: 'Areas', items: ['Unit tests', 'Integration tests', 'Contract testing', 'Mocking data'], plain: true },
        { label: 'Mindset', items: ['Shift-left testing', 'Reproducible bug reports', 'Clear acceptance criteria'], plain: true },
      ],
    },
    {
      title: 'DevOps & Delivery',
      icon: Rocket,
      accent: 'from-amber-50 via-white to-amber-50 dark:from-amber-500/10 dark:via-slate-950 dark:to-amber-500/5',
      sections: [
        { label: 'CI/CD', items: ['Azure DevOps pipelines', 'GitHub Actions'], plain: true },
        { label: 'Build & Deploy', items: ['Environment config', 'Release readiness'], plain: true },
        { label: 'Infrastructure', items: ['Azure App Services', 'Secrets handling'], plain: true },
        { label: 'Monitoring', items: ['App Insights', 'Firebase analytics', 'Log-based alerting'], plain: true },
      ],
    },
  ]

  /**
   * Quick bullets describing strengths.
   */
  const goodAt = [
    'Turning designs into well-structured, accessible UIs',
    'Debugging calmly and communicating tradeoffs clearly',
    'Making code easy for the next engineer to extend',
    'Improving slow or unclear API calls with better contracts',
    'Moving between frontend polish and backend logic as needed',
  ]

  /**
   * Portfolio-ready achievements backing up the skill summary.
   */
  const highlights = [
    'Built and maintained React/TypeScript frontends using reusable components, RTK Query data layers, and accessible UI patterns.',
    'Developed RESTful APIs and C#/.NET services integrated with SQL Server, Cosmos DB, and Firebase.',
    'Improved reliability by adding automated tests (Vitest, Pytest, Jest) and refining CI/CD pipelines in Azure DevOps.',
    'Used GitHub + Git to manage branches, run reviews, document changes, and ensure clean releases.',
    'Collaborated across UX, backend, and product to deliver scoped iterations in steady cadence.',
  ]

  return (
    <section className="grid gap-10 text-slate-900 dark:text-slate-100">
      <header className="space-y-3">
        <h2 className="section-title">Tech Stack & Skills</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Frontend-leaning full-stack engineer focused on accessible UIs, clean architecture, and reliable delivery.
        </p>
      </header>

      <div className="grid xl:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <CategoryCard key={cat.title} {...cat} />
        ))}
      </div>

      <section className="grid md:grid-cols-2 gap-6">
        <article className="card p-6 space-y-3">
          <h3 className="font-semibold text-lg">What I’m Good At</h3>
          <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
            {goodAt.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="card p-6 space-y-3">
          <h3 className="font-semibold text-lg">How I Work</h3>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            I approach work by breaking problems down, communicating early, and shipping in steady increments. I like writing clear code that’s
            easy for teammates to build on, and I’m comfortable moving between frontend details and backend logic when needed.
          </p>
        </article>
      </section>

      <section className="card p-6 space-y-4 bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
        <h3 className="font-semibold text-lg">Recent Experience Highlights</h3>
        <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-2">
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </section>
  )
}

/**
 * Renders a gradient card for a given skill category.
 */
function CategoryCard({
  title,
  icon: Icon,
  accent,
  sections,
}: {
  title: string
  icon: ComponentType<{ size?: number; className?: string }>
  accent: string
  sections: { label: string; items: string[]; plain?: boolean }[]
}) {
  return (
    <article
      className={`rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br ${accent} p-6 lg:p-8 space-y-4 shadow-lg shadow-slate-400/10 dark:shadow-none`}
    >
      <div className="flex items-center gap-3">
        <span className="h-11 w-11 rounded-2xl bg-white/70 dark:bg-slate-900/60 text-emerald-500 grid place-items-center">
          <Icon size={20} />
        </span>
        <h3 className="font-semibold text-lg">{title}</h3>
      </div>
      {sections.map((section) => (
        <SectionGroup key={`${title}-${section.label}`} {...section} />
      ))}
    </article>
  )
}

/**
 * Shows a titled row of tech tokens or plain text descriptors.
 */
function SectionGroup({ label, items, plain }: { label: string; items: string[]; plain?: boolean }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <div className={`flex flex-wrap gap-2 text-sm leading-relaxed ${plain ? 'text-slate-600 dark:text-slate-300' : ''}`}>
        {items.map((item) => (plain ? <span key={item}>{item}</span> : <Pill key={item}>{item}</Pill>))}
      </div>
    </div>
  )
}
