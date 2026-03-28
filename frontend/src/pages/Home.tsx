import { motion } from 'framer-motion'
import { projects } from '@/data/profile'
import { Link } from 'react-router-dom'
import { ArrowUpRight} from 'lucide-react'
import Avatar from '@/components/user/Avatar'
import Badge from '@/components/data-display/Badge'

/**
 * Landing page hero plus teaser cards for select projects.
 */
const Home = () => {
  return (
    <section className="grid gap-10">
      <div className="card p-10 text-slate-900 dark:text-slate-100">
        <Avatar initials="RH" label="Ryley Hynes" />
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
        {projects.slice(0, 3).map((p, i) => {
          const isLive = p.isLive === true
          const primaryLink = p.links.find(link => link.label === 'View Project') ?? p.links[0]
          const isInternal = primaryLink?.href.startsWith('/')
          return (
          <motion.article
            key={p.name}
            className={[
              'card p-6 text-slate-900 dark:text-slate-100',
              isLive ? '' : 'card-coming-soon'
            ].join(' ')}
            aria-disabled={isLive ? undefined : true}
            title={isLive ? undefined : 'Live demos coming soon'}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: i * 0.07 }}
          >
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-200">{p.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
            {isLive && primaryLink ? (
              <div className="mt-4">
                {isInternal ? (
                  <Link className="navlink" to={primaryLink.href}>
                    {primaryLink.label}
                  </Link>
                ) : (
                  <a className="navlink" href={primaryLink.href} target="_blank" rel="noreferrer">
                    {primaryLink.label}
                  </a>
                )}
              </div>
            ) : null}
          </motion.article>
          )
        })}
      </div>
    </section>
  )
}

export default Home
