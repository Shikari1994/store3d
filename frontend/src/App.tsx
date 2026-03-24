import { useState, useEffect, lazy, Suspense } from 'react'
import ProductGrid from './components/ProductGrid'
import ProductDetail from './components/ProductDetail'
import Cart from './components/Cart'
import { useCartStore } from './stores/cartStore'

const AdminPanel = lazy(() => import('./admin/AdminPanel'))

type View = { type: 'list' } | { type: 'detail'; productId: string }

function getSection() {
  return window.location.hash === '#admin' ? 'admin' : 'store'
}

export default function App() {
  const [section, setSection] = useState(getSection)
  const [view, setView] = useState<View>({ type: 'list' })
  const { items, toggleCart } = useCartStore()
  const totalItems = items.reduce((sum, i) => sum + i.qty, 0)

  useEffect(() => {
    const handler = () => setSection(getSection())
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  if (section === 'admin') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>}>
        <AdminPanel />
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="glass bg-slate-950/95 border-b border-white/5 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <button
          onClick={() => setView({ type: 'list' })}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 20.25h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-gradient font-bold text-sm tracking-tight">НГ Телеметрия</span>
            <span className="text-slate-500 text-[10px] font-medium tracking-wide uppercase">Нефтегаз оборудование</span>
          </div>
        </button>

        <div className="flex items-center gap-1">
        <button
          onClick={() => { window.location.hash = '#admin' }}
          className="p-2 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-white/10"
          aria-label="Управление"
          title="Управление"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>

        <button
          onClick={toggleCart}
          className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
          aria-label="Заявка"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-amber-500 to-orange-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-lg">
              {totalItems}
            </span>
          )}
        </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-12">
        {view.type === 'list' ? (
          <ProductGrid onSelect={(id) => setView({ type: 'detail', productId: id })} />
        ) : (
          <ProductDetail
            productId={view.productId}
            onBack={() => setView({ type: 'list' })}
          />
        )}
      </main>

      <Cart />
    </div>
  )
}
