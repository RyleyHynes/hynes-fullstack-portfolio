import { Link } from 'react-router-dom'

const products = [
  { id: 'alpine-pack', name: 'Alpine Guide Pack', price: '$249', detail: '40L expedition pack' },
  { id: 'weather-kit', name: 'Weather Window Kit', price: '$89', detail: 'Forecast + safety bundle' },
  { id: 'camp-system', name: 'Camp System Lite', price: '$199', detail: 'Shelter + sleep kit' },
]

export default function Shop() {
  return (
    <section className="grid gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-600">Shop</p>
        <h1 className="text-3xl font-semibold">Gear that matches your route and plan.</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
          Curated packs and products based on conditions, route profile, and expedition goals.
        </p>
      </header>

      <div className="flex items-center gap-4 text-sm text-slate-500">
        <span className="font-semibold text-emerald-600">Browse</span>
        <span>Packs</span>
        <span>Cart</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map(product => (
          <Link key={product.id} to={`/apps/celium/shop/products/${product.id}`} className="card p-5 hover:border-emerald-200">
            <div className="h-32 rounded-xl bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-emerald-900/40 dark:via-slate-900 dark:to-sky-900/30 border border-slate-200/60 dark:border-slate-800" />
            <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
            <p className="text-sm text-slate-500">{product.detail}</p>
            <p className="mt-2 text-sm font-semibold text-emerald-600">{product.price}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
