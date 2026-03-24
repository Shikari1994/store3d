import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import LoginPage from './LoginPage'
import AdminProducts from './Products'
import AdminProductForm from './ProductForm'
import type { Product } from '../types'

type View = 'list' | 'create' | { type: 'edit'; product: Product }

export default function AdminPanel() {
  const { token, clientId, clientName, logout } = useAuthStore()
  const [view, setView] = useState<View>('list')
  const qc = useQueryClient()

  if (!token || !clientId) return <LoginPage />

  const handleSaved = () => {
    qc.invalidateQueries({ queryKey: ['admin-products'] })
    setView('list')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-gray-800">Store3D — Админ-панель</h1>
            {clientName && <p className="text-xs text-gray-400 mt-0.5">{clientName}</p>}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {clientId}
            </span>
            <button
              onClick={() => { window.location.hash = '' }}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              В магазин
            </button>
            <button
              onClick={() => {
                logout()
                window.location.hash = ''
              }}
              className="text-sm text-red-400 hover:text-red-600 transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        {view === 'list' ? (
          <AdminProducts
            clientId={clientId}
            onCreate={() => setView('create')}
            onEdit={(product) => setView({ type: 'edit', product })}
          />
        ) : (
          <AdminProductForm
            clientId={clientId}
            product={typeof view === 'object' ? view.product : undefined}
            onBack={() => setView('list')}
            onSaved={handleSaved}
          />
        )}
      </main>
    </div>
  )
}
