import { profile } from '@/data/profile'
import { Mail, Phone, Github, Linkedin } from 'lucide-react'

/**
 * Contact options supporting direct outreach across channels.
 */
export default function Contact() {
  /**
   * Normalized list of connection methods and their associated icons/links.
   */
  const contactLinks = [
    { label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/[^0-9+]/g, '')}`, icon: Phone },
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: Mail },
    { label: 'LinkedIn', value: '@ryleyhynes', href: profile.linkedin, icon: Linkedin },
    { label: 'GitHub', value: '@RyleyHynes', href: profile.github, icon: Github },
  ] as const

  return (
    <section className="grid gap-10 text-slate-900 dark:text-slate-100">
      <header className="grid gap-4">
        <div>
          <h2 className="section-title">Contact</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-3xl">
            Need a product-minded engineer who ships polished experiences fast? Reach me directly on any channel below and I’ll reply quickly
            with next steps or a portfolio walkthrough.
          </p>
        </div>
        <div className="card p-6 grid gap-4">
          <h3 className="text-lg font-semibold">Ways I can help</h3>
          <div className="grid sm:grid-cols-4 gap-3 text-sm text-slate-600 dark:text-slate-300">
            {['UI engineering', 'API integration', 'Testing & QA', 'DevOps enablement'].map((item) => (
              <div key={item} className="rounded-xl px-3 py-2 text-center font-medium bg-gradient-to-r from-slate-100 to-slate-50 dark:from-white/10 dark:to-white/5 border border-slate-200/70 dark:border-white/10 shadow-sm">
                {item}
              </div>
            ))}
          </div>
        </div>
      </header>

      <ul className="grid gap-4 md:grid-cols-2">
        {contactLinks.map(({ label, value, href, icon: Icon }) => (
          <li key={label} className="card p-6 flex flex-col gap-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
              <a
                className="text-2xl font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
                href={href}
                target={label === 'Phone' || label === 'Email' ? undefined : '_blank'}
                rel={label === 'Phone' || label === 'Email' ? undefined : 'noreferrer'}
              >
                {value}
              </a>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Available weekdays 8a–6p (CST)</span>
              <Icon className="text-slate-400 dark:text-slate-500" size={32} aria-hidden="true" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
