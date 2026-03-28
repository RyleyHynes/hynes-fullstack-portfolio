import { Link } from 'react-router-dom'
import { useState } from 'react'
import CardFooter from '@/components/layout/CardFooter'
import CardHeader from '@/components/layout/CardHeader'
import Pagination from '@/components/data-display/Pagination'
import SectionHeader from '@/components/layout/SectionHeader'

const products = [
  { id: 'alpine-pack', name: 'Alpine Guide Pack', price: '$249', detail: '40L expedition pack' },
  { id: 'weather-kit', name: 'Weather Window Kit', price: '$89', detail: 'Forecast + safety bundle' },
  { id: 'camp-system', name: 'Camp System Lite', price: '$199', detail: 'Shelter + sleep kit' },
]

const Shop = () => {
  const [page, setPage] = useState(1)
  return (
    <section className="grid gap-6">
      <SectionHeader
        eyebrow="Shop"
        title="Gear that matches your route and plan."
        subtitle="Curated packs and products based on conditions, route profile, and expedition goals."
      />

      <div className="flex items-center gap-4 text-sm text-slate-500">
        <span className="font-semibold text-emerald-600">Browse</span>
        <span>Packs</span>
        <span>Cart</span>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map(product => (
          <Link key={product.id} to={`/apps/celium/shop/products/${product.id}`} className="card p-5 hover:border-emerald-200">
            <div className="h-32 rounded-xl bg-gradient-to-br from-emerald-100 via-white to-sky-100 dark:from-emerald-900/40 dark:via-slate-900 dark:to-sky-900/30 border border-slate-200/60 dark:border-slate-800" />
            <CardHeader title={product.name} subtitle={product.detail} />
            <CardFooter>
              <span className="text-sm font-semibold text-emerald-600">{product.price}</span>
            </CardFooter>
          </Link>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={1}
        onChange={setPage}
        label="Browse"
      />
    </section>
  )
}

export default Shop
