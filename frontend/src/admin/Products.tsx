import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api/adminApi'
import type { Product } from '../types'

export default function AdminProducts({
  clientId,
  onCreate,
  onEdit,
}: {
  clientId: string
  onCreate: () => void
  onEdit: (product: Product) => void
}) {
  const qc = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products', clientId],
    queryFn: async () => {
      const { data } = await adminApi.get<Product[]>('/api/admin/products')
      return data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminApi.delete(`/api/admin/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Товары</h2>
        <button
          onClick={onCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Добавить товар
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : !products?.length ? (
        <div className="text-center py-16 text-gray-400 border-2 border-dashed rounded-xl">
          <div className="text-4xl mb-3">📦</div>
          <p className="font-medium">Товаров пока нет</p>
          <p className="text-sm mt-1">Нажмите «Добавить товар» чтобы начать</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Название</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Категория</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Цена</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">3D</th>
                <th className="px-4 py-3 text-gray-500 font-medium">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{product.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5 font-mono">{product.id}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{product.category || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {product.price != null
                      ? `${product.price.toLocaleString('ru-RU')} ₽`
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {product.modelUrl ? (
                      <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full font-medium">
                        Есть
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs">Нет</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.isActive ? (
                      <span className="text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded-full">
                        Активен
                      </span>
                    ) : (
                      <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                        Скрыт
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onEdit(product)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors mr-1"
                      title="Изменить"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        window.confirm(`Удалить «${product.name}»?`) &&
                        deleteMutation.mutate(product.id)
                      }
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
