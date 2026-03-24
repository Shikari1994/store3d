import type { Product } from '../types'

export default function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/60 transition-all duration-300 cursor-pointer overflow-hidden animate-fade-in"
    >
      <div className="relative bg-slate-50 h-52 flex items-center justify-center overflow-hidden">
        {(product.imageUrl || product.photos?.[0]) ? (
          <img
            src={product.imageUrl ?? product.photos![0]}
            alt={product.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-300 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12 20.25h.008v.008H12v-.008Z" />
            </svg>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-2.5 left-2.5 right-2.5 flex justify-between items-start gap-1.5">
          {product.category && (
            <span className="bg-white/90 backdrop-blur text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm truncate max-w-[60%]">
              {product.category}
            </span>
          )}
          {product.modelUrl && (
            <span className="ml-auto shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md shadow-amber-300/50 tracking-wide">
              3D
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 leading-snug mb-3">{product.name}</h3>
        <div className="flex items-center justify-between">
          {product.price != null ? (
            <p className="text-base font-bold text-amber-600">{product.price.toLocaleString('ru-RU')} ₽</p>
          ) : (
            <p className="text-sm text-slate-400">Цена по запросу</p>
          )}
          <div className="w-7 h-7 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
