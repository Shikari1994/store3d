import { useState, useEffect } from 'react'
import { useProduct } from '../api/products'
import ModelViewer from './ModelViewer'
import { useCartStore } from '../stores/cartStore'

export default function ProductDetail({ productId, onBack }: { productId: string; onBack: () => void }) {
  const { data: product, isLoading } = useProduct(productId)
  const { addItem, toggleCart } = useCartStore()
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState<'3d' | 'photos'>('3d')
  const [selectedPhoto, setSelectedPhoto] = useState(0)

  useEffect(() => {
    if (!product) return
    setActiveTab(!product.modelUrl && product.photos?.length ? 'photos' : '3d')
    setSelectedPhoto(0)
  }, [product?.id])

  if (isLoading) {
    return (
      <div className="pt-8">
        <div className="h-4 w-24 bg-slate-100 rounded-full mb-8 animate-skeleton" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-100 rounded-2xl h-80 animate-skeleton" />
          <div className="space-y-4">
            <div className="h-3 bg-slate-100 rounded-full w-1/4 animate-skeleton" />
            <div className="h-7 bg-slate-100 rounded-full w-3/4 animate-skeleton" />
            <div className="h-4 bg-slate-100 rounded-full w-full animate-skeleton" />
            <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-skeleton" />
            <div className="h-9 bg-slate-100 rounded-full w-1/3 mt-4 animate-skeleton" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const handleAddToCart = () => {
    addItem({ productId: product.id, name: product.name, qty: 1, price: product.price })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    toggleCart()
  }

  const hasModel = !!product.modelUrl
  const photos = product.photos ?? []
  const hasPhotos = photos.length > 0
  const showTabs = hasModel && hasPhotos

  const tabCls = (active: boolean) =>
    `flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors ${
      active ? 'text-amber-600 border-b-2 border-amber-500 -mb-px' : 'text-slate-400 hover:text-slate-600'
    }`

  return (
    <div className="pt-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 mb-6 text-sm transition-colors group">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Назад к каталогу
      </button>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Media block */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
          {showTabs && (
            <div className="flex border-b border-slate-100">
              <button onClick={() => setActiveTab('3d')} className={tabCls(activeTab === '3d')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
                3D модель
              </button>
              <button onClick={() => setActiveTab('photos')} className={tabCls(activeTab === 'photos')}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                Фото ({photos.length})
              </button>
            </div>
          )}

          {(!showTabs || activeTab === '3d') && hasModel && <ModelViewer url={product.modelUrl!} />}

          {((showTabs && activeTab === 'photos') || (!hasModel && hasPhotos)) && (
            <div>
              <div className="relative bg-slate-50 overflow-hidden" style={{ height: '320px' }}>
                <img src={photos[selectedPhoto]} alt={product.name} className="w-full h-full object-contain" />
                {photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedPhoto((prev) => (prev - 1 + photos.length) % photos.length)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur shadow flex items-center justify-center text-slate-600 hover:bg-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedPhoto((prev) => (prev + 1) % photos.length)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur shadow flex items-center justify-center text-slate-600 hover:bg-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                    <span className="absolute bottom-2 right-2 bg-black/40 text-white text-xs px-2 py-0.5 rounded-full">
                      {selectedPhoto + 1} / {photos.length}
                    </span>
                  </>
                )}
              </div>
              {photos.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {photos.map((url, i) => (
                    <button
                      key={url}
                      onClick={() => setSelectedPhoto(i)}
                      className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                        i === selectedPhoto ? 'border-amber-500 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!hasModel && !hasPhotos && <ModelViewer url="/models/test_model.glb" />}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.category && (
            <span className="inline-flex items-center self-start px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold uppercase tracking-widest mb-3">
              {product.category}
            </span>
          )}

          <h1 className="text-2xl font-extrabold text-slate-900 leading-tight mb-3">{product.name}</h1>

          {product.description && (
            <p className="text-slate-500 text-sm leading-relaxed mb-5 border-l-2 border-slate-200 pl-3">{product.description}</p>
          )}


          <div className="flex flex-wrap gap-2 mb-6">
            {hasModel && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
                3D модель
              </span>
            )}
            {hasPhotos && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-100 text-sky-700 text-xs font-medium">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                {photos.length} фото
              </span>
            )}
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Доступно к заказу
            </span>
          </div>

          {product.price != null && (
            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs text-slate-400 mb-1 font-medium uppercase tracking-wide">Стоимость</p>
              <p className="text-3xl font-extrabold text-slate-900">
                {product.price.toLocaleString('ru-RU')}{' '}<span className="text-amber-500">₽</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Без НДС · Уточняйте условия поставки</p>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            className={`mt-auto w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
              added
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200 hover:shadow-amber-300 hover:-translate-y-0.5'
            }`}
          >
            {added ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Добавлено в заявку
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
                Добавить в заявку
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
