import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { adminApi } from '../api/adminApi'
import type { Product } from '../types'

const schema = z.object({
  name: z.string().min(1, 'Обязательное поле'),
  description: z.string().optional(),
  price: z.string().optional(),
  category: z.string().optional(),
  isActive: z.boolean(),
})

type FormData = z.infer<typeof schema>

const FILE_COLORS = {
  blue: 'file:bg-blue-50   file:text-blue-600   hover:file:bg-blue-100',
  green: 'file:bg-green-50  file:text-green-600  hover:file:bg-green-100',
  purple: 'file:bg-purple-50 file:text-purple-600 hover:file:bg-purple-100',
}
const fileCls = (color: keyof typeof FILE_COLORS) =>
  `w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:border file:rounded-lg file:text-sm file:font-medium file:cursor-pointer ${FILE_COLORS[color]}`

const inputCls =
  'w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

export default function AdminProductForm({
  clientId,
  product,
  onBack,
  onSaved,
}: {
  clientId: string
  product?: Product
  onBack: () => void
  onSaved: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [modelFile, setModelFile] = useState<File | null>(null)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [previewLocalUrl, setPreviewLocalUrl] = useState<string | null>(null)
  const [photoFiles, setPhotoFiles] = useState<{ file: File; localUrl: string }[]>([])
  const [currentPhotos, setCurrentPhotos] = useState<string[]>(product?.photos ?? [])
  const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>(product?.imageUrl)
  const [error, setError] = useState('')
  const photoInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: product?.name ?? '',
      description: product?.description ?? '',
      price: product?.price != null ? String(product.price) : '',
      category: product?.category ?? '',
      isActive: product?.isActive ?? true,
    },
  })

  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreviewFile(file)
    setPreviewLocalUrl(URL.createObjectURL(file))
  }

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setPhotoFiles((prev) => [
      ...prev,
      ...files.map((file) => ({ file, localUrl: URL.createObjectURL(file) })),
    ])
    if (photoInputRef.current) photoInputRef.current.value = ''
  }

  const removeNewPhoto = (idx: number) => {
    setPhotoFiles((prev) => {
      URL.revokeObjectURL(prev[idx].localUrl)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const deleteExistingPhoto = async (url: string) => {
    if (!product) return
    try {
      await adminApi.delete(`/api/admin/products/${product.id}/photos`, { params: { url } })
      setCurrentPhotos((prev) => prev.filter((p) => p !== url))
    } catch {
      alert('Ошибка удаления фото')
    }
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        ...data,
        price: data.price ? parseFloat(data.price) : undefined,
        clientId,
      }

      const saved = product
        ? (await adminApi.put<Product>(`/api/admin/products/${product.id}`, payload)).data
        : (await adminApi.post<Product>('/api/admin/products', payload)).data

      const upload = async <T,>(endpoint: string, file: File) => {
        const fd = new FormData()
        fd.append('file', file)
        return (await adminApi.post<T>(`/api/admin/products/${saved.id}/${endpoint}`, fd)).data
      }

      if (modelFile) await upload('model', modelFile)

      if (previewFile) {
        const res = await upload<{ imageUrl: string }>('preview', previewFile)
        setCurrentImageUrl(res.imageUrl)
        setPreviewFile(null)
        setPreviewLocalUrl(null)
      }

      for (const { file } of photoFiles) {
        const res = await upload<{ photoUrl: string }>('photos', file)
        setCurrentPhotos((prev) => [...prev, res.photoUrl])
      }
      setPhotoFiles([])

      onSaved()
    } catch {
      setError('Ошибка сохранения. Проверьте соединение с сервером.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="text-gray-500 hover:text-gray-800 text-sm mb-6 transition-colors"
      >
        ← Назад к списку
      </button>

      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {product ? 'Редактировать товар' : 'Новый товар'}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl border p-6 space-y-5 max-w-lg"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Название <span className="text-red-500">*</span>
          </label>
          <input {...register('name')} className={inputCls} placeholder="Название товара" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание</label>
          <textarea
            {...register('description')}
            rows={3}
            className={`${inputCls} resize-none`}
            placeholder="Краткое описание товара"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Цена (₽)</label>
            <input
              {...register('price')}
              type="number"
              min="0"
              className={inputCls}
              placeholder="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Категория</label>
            <input
              {...register('category')}
              className={inputCls}
              placeholder="Мебель, Кресла..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">3D модель (.glb)</label>
          {product?.modelUrl && (
            <p className="text-xs text-green-600 mb-1.5">✓ Загружена: {product.modelUrl}</p>
          )}
          <input
            type="file"
            accept=".glb"
            onChange={(e) => setModelFile(e.target.files?.[0] ?? null)}
            className={fileCls('blue')}
          />
          <p className="text-xs text-gray-400 mt-1">Максимум 50 МБ</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Превью (обложка)</label>
          {(previewLocalUrl || currentImageUrl) && (
            <div className="mb-2 relative inline-block">
              <img
                src={previewLocalUrl ?? currentImageUrl}
                alt="preview"
                className="h-24 w-24 object-cover rounded-lg border"
              />
              {previewLocalUrl && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  новое
                </span>
              )}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePreviewChange}
            className={fileCls('green')}
          />
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP · Максимум 10 МБ</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Фотографии товара
          </label>

          {currentPhotos.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {currentPhotos.map((url) => (
                <div key={url} className="relative group">
                  <img src={url} alt="" className="h-20 w-20 object-cover rounded-lg border" />
                  {product && (
                    <button
                      type="button"
                      onClick={() => deleteExistingPhoto(url)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Удалить фото"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {photoFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {photoFiles.map(({ localUrl }, idx) => (
                <div key={localUrl} className="relative group">
                  <img
                    src={localUrl}
                    alt=""
                    className="h-20 w-20 object-cover rounded-lg border border-dashed border-blue-300"
                  />
                  <span className="absolute -top-1.5 -left-1.5 bg-blue-500 text-white text-[10px] font-bold px-1 py-0.5 rounded-full">
                    +
                  </span>
                  <button
                    type="button"
                    onClick={() => removeNewPhoto(idx)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Убрать"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoAdd}
            className={fileCls('purple')}
          />
          <p className="text-xs text-gray-400 mt-1">Можно выбрать несколько файлов</p>
        </div>

        <div className="flex items-center gap-2">
          <input
            {...register('isActive')}
            type="checkbox"
            id="isActive"
            className="w-4 h-4 text-blue-600 rounded"
          />
          <label htmlFor="isActive" className="text-sm text-gray-700">
            Показывать в каталоге
          </label>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Сохранение...' : product ? 'Сохранить изменения' : 'Создать товар'}
        </button>
      </form>
    </div>
  )
}
