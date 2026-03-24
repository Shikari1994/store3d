import { useState } from 'react'
import { useCartStore } from '../stores/cartStore'
import OrderForm from './OrderForm'

export default function Cart() {
  const { items, isOpen, toggleCart, removeItem, updateQty, clear } = useCartStore()
  const [showForm, setShowForm] = useState(false)
  const total = items.reduce((sum, i) => sum + (i.price ?? 0) * i.qty, 0)

  if (!isOpen) return null

  const handleClose = () => { setShowForm(false); toggleCart() }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20" onClick={handleClose} />

      <div className="fixed right-0 top-0 h-full w-[22rem] bg-white shadow-2xl z-30 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-white text-sm leading-none">Заявка</h2>
              {items.length > 0 && (
                <p className="text-slate-500 text-[10px] mt-0.5">{items.length} {items.length === 1 ? 'позиция' : items.length < 5 ? 'позиции' : 'позиций'}</p>
              )}
            </div>
          </div>
          <button onClick={handleClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">Заявка пуста</p>
              <p className="text-xs text-slate-400 mt-0.5">Добавьте оборудование из каталога</p>
            </div>
          </div>
        ) : showForm ? (
          <OrderForm onBack={() => setShowForm(false)} onSuccess={() => { clear(); handleClose() }} />
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 scrollbar-thin">
              {items.map((item) => (
                <div key={item.productId} className="flex items-start gap-3 bg-slate-50 rounded-xl p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 leading-snug">{item.name}</p>
                    {item.price != null && (
                      <>
                        <p className="text-xs text-slate-400 mt-0.5">{item.price.toLocaleString('ru-RU')} ₽ × {item.qty}</p>
                        <p className="text-sm font-semibold text-amber-600 mt-1">{(item.price * item.qty).toLocaleString('ru-RU')} ₽</p>
                      </>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => removeItem(item.productId)} className="text-slate-300 hover:text-red-400 transition-colors">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => item.qty > 1 ? updateQty(item.productId, item.qty - 1) : removeItem(item.productId)}
                        className="w-6 h-6 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center text-sm hover:bg-slate-100 transition-colors font-medium"
                      >−</button>
                      <span className="text-sm w-4 text-center font-semibold text-slate-700">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        className="w-6 h-6 rounded-lg border border-slate-200 bg-white text-slate-600 flex items-center justify-center text-sm hover:bg-slate-100 transition-colors font-medium"
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-slate-100 bg-white">
              {total > 0 && (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-slate-500">Итого (без НДС)</span>
                    <span className="font-extrabold text-slate-900 text-lg">{total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-4">Окончательная стоимость уточняется менеджером</p>
                </>
              )}
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-xl font-semibold text-sm hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-200 hover:shadow-amber-300 hover:-translate-y-0.5"
              >
                Оформить заявку →
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
