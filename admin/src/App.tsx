import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Products from './pages/Products'
import ProductForm from './pages/ProductForm'
import type { Product } from './types'

const CLIENT_ID = 'demo'

type View = 'list' | 'create' | { type: 'edit'; product: Product }

export default function App() {
  const [view, setView] = useState<View>('list')
  const qc = useQueryClient()

  const handleSaved = () => {
    qc.invalidateQueries({ queryKey: ['admin-products'] })
    setView('list')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-800">Store3D — Админ-панель</h1>
          <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">clientId: {CLIENT_ID}</span>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        {view === 'list' ? (
          <Products
            clientId={CLIENT_ID}
            onCreate={() => setView('create')}
            onEdit={(product) => setView({ type: 'edit', product })}
          />
        ) : (
          <ProductForm
            clientId={CLIENT_ID}
            product={typeof view === 'object' ? view.product : undefined}
            onBack={() => setView('list')}
            onSaved={handleSaved}
          />
        )}
      </main>
    </div>
  )
}
