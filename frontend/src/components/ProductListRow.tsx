import type { Product } from '../types'

export default function ProductListRow({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group flex items-center gap-4 bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-200 cursor-pointer p-3 animate-fade-in"
    >
      <div className="relative shrink-0 w-24 h-20 rounded-xl overflow-hidden bg-slate-50 flex items-center justify-center">
        {(product.imageUrl || product.photos?.[0]) ? (
          <img
            src={product.imageUrl ?? product.photos![0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 20.25h.008v.008H12v-.008Z" />
          </svg>
        )}
        {product.modelUrl && (
          <span className="absolute bottom-1 right-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
            3D
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {product.category && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{product.category}</span>
          </div>
        )}
        <h3 className="font-semibold text-slate-800 text-sm leading-snug truncate">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">{product.description}</p>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-3">
        {product.price != null ? (
          <p className="text-sm font-bold text-amber-600 whitespace-nowrap">{product.price.toLocaleString('ru-RU')} ₽</p>
        ) : (
          <p className="text-xs text-slate-400 whitespace-nowrap">По запросу</p>
        )}
        <div className="w-8 h-8 rounded-xl bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center text-slate-400 group-hover:text-amber-600 transition-colors">
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </div>
  )
}
