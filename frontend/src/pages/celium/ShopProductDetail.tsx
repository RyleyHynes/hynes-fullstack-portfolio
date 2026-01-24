import { Link, useParams } from 'react-router-dom'

export default function ShopProductDetail() {
  const { productId } = useParams()

  return (
    <section className="grid gap-6">
      <Link to="/apps/celium/shop" className="text-xs text-slate-500 hover:text-emerald-600">
        ← Back to Shop
      </Link>

      <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6">
        <div className="card p-6">
          <div className="h-64 rounded-2xl bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-emerald-900/40 dark:via-slate-900 dark:to-sky-900/30 border border-slate-200/60 dark:border-slate-800" />
          <h1 className="mt-4 text-3xl font-semibold">Alpine Guide Pack</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Built for high-output days with room for safety gear, water, and layers.
          </p>
          <p className="mt-3 text-xs text-slate-400">Product ID: {productId}</p>
        </div>

        <aside className="card p-6">
          <h2 className="text-lg font-semibold">Included</h2>
          <ul className="mt-3 grid gap-2 text-sm text-slate-600 dark:text-slate-300">
            <li>40L weatherproof pack</li>
            <li>Emergency kit + repair patches</li>
            <li>Guide checklist + route notes</li>
          </ul>
          <div className="mt-6">
            <p className="text-sm text-slate-500">Bundle price</p>
            <p className="text-2xl font-semibold text-emerald-600">$249</p>
          </div>
          <button className="mt-4 btn-primary w-full">Add to Gear List</button>
        </aside>
      </div>
    </section>
  )
}
