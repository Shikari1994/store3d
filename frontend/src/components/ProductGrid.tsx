import { useState } from 'react'
import { useProducts } from '../api/products'
import ProductCard from './ProductCard'
import ProductListRow from './ProductListRow'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-skeleton">
      <div className="bg-slate-100 h-52" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-slate-100 rounded-full w-1/3" />
        <div className="h-4 bg-slate-100 rounded-full w-4/5" />
        <div className="h-4 bg-slate-100 rounded-full w-2/3" />
        <div className="h-5 bg-slate-100 rounded-full w-1/3 mt-3" />
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl border border-slate-100 p-3 animate-skeleton">
      <div className="w-24 h-20 rounded-xl bg-slate-100 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-slate-100 rounded-full w-1/4" />
        <div className="h-4 bg-slate-100 rounded-full w-3/5" />
        <div className="h-3 bg-slate-100 rounded-full w-4/5" />
      </div>
      <div className="shrink-0 flex items-center gap-3">
        <div className="h-4 bg-slate-100 rounded-full w-20" />
        <div className="w-8 h-8 rounded-xl bg-slate-100" />
      </div>
    </div>
  )
}

const filterCls = (active: boolean) =>
  `px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
    active
      ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
      : 'bg-white border border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-700'
  }`

export default function ProductGrid({ onSelect }: { onSelect: (id: string) => void }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { data: products, isLoading, error } = useProducts({ search, category })

  const categories = [...new Set(products?.map((p) => p.category).filter(Boolean))] as string[]

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-semibold text-slate-700">Не удалось загрузить каталог</p>
          <p className="text-sm text-slate-400 mt-1">Проверьте, запущен ли backend-сервер</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-6">
      <div className="flex gap-2 mb-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Поиск оборудования..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow"
          />
        </div>

        <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm gap-0.5">
          <button
            onClick={() => setViewMode('grid')}
            title="Сетка"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              viewMode === 'grid' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            title="Список"
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              viewMode === 'list' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
          </button>
        </div>
      </div>

      {(isLoading || categories.length > 0) && (
        <div className="flex gap-2 flex-wrap mb-5">
          <button onClick={() => setCategory('')} className={filterCls(category === '')}>Все категории</button>
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(category === c ? '' : c)} className={filterCls(category === c)}>{c}</button>
          ))}
        </div>
      )}

      {!isLoading && products && products.length > 0 && (
        <p className="text-xs text-slate-400 mb-4">
          Найдено: {products.length} {products.length === 1 ? 'позиция' : products.length < 5 ? 'позиции' : 'позиций'}
        </p>
      )}

      {isLoading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        )
      ) : !products?.length ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-700">Ничего не найдено</p>
            <p className="text-sm text-slate-400 mt-1">Попробуйте изменить параметры поиска</p>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => onSelect(product.id)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {products.map((product) => (
            <ProductListRow key={product.id} product={product} onClick={() => onSelect(product.id)} />
          ))}
        </div>
      )}
    </div>
  )
}
