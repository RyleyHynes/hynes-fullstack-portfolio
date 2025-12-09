import { motion } from 'framer-motion'
import { projects } from '@/data/profile'
import { Link } from 'react-router-dom'
import { ArrowUpRight} from 'lucide-react'

/**
 * Landing page hero plus teaser cards for select projects.
 */
export default function Home() {
  return (
    <section className="grid gap-10">
      <div className="card p-10 text-slate-900 dark:text-slate-100">
        <p className="text-sm uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-300">Full-stack engineer</p>
        <h1 className="section-title mt-3">Crafting dependable software for healthcare & beyond.</h1>
        <p className="mt-4 text-lg text-slate-600 dark:text-slate-300 max-w-3xl">
          I focus on clear architecture, thoughtful UI, and steady delivery — React + TypeScript on the frontend, Python/Django and C#/.NET on the
          backend. My goal: build modern software that teams enjoy maintaining.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/projects" className="btn-primary inline-flex items-center gap-2">
            Explore Projects <ArrowUpRight size={16} />
          </Link>
          <Link to="/contact" className="btn-ghost">
            Contact
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {projects.slice(0, 3).map((p, i) => (
          <motion.article
            key={p.name}
            className="card card-coming-soon p-6 text-slate-900 dark:text-slate-100"
            aria-disabled="true"
            title="Live demos coming soon"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.07 }}
          >
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">{p.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <span key={s} className="badge">
                  {s}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
