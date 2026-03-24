import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import type { Product } from '../types'

export default function Products({ clientId, onCreate, onEdit }: {
  clientId: string
  onCreate: () => void
  onEdit: (product: Product) => void
}) {
  const qc = useQueryClient()

  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products', clientId],
    queryFn: async () => {
      const { data } = await axios.get<Product[]>('/api/admin/products', { params: { clientId } })
      return data
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/admin/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-products'] }),
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Товары</h2>
        <button onClick={onCreate} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
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
                  <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                  <td className="px-4 py-3 text-gray-500">{product.category || '—'}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {product.price != null ? `${product.price.toLocaleString('ru-RU')} ₽` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {product.modelUrl ? (
                      <span className="text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full font-medium">Есть</span>
                    ) : (
                      <span className="text-gray-400 text-xs">Нет</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {product.isActive ? (
                      <span className="text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded-full">Активен</span>
                    ) : (
                      <span className="text-gray-400 text-xs bg-gray-100 px-2 py-0.5 rounded-full">Скрыт</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-800 mr-4 transition-colors">
                      Изменить
                    </button>
                    <button
                      onClick={() => window.confirm(`Удалить «${product.name}»?`) && deleteMutation.mutate(product.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Удалить
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
