import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCartStore } from '../stores/cartStore'
import { useClientId } from '../hooks/useClientId'
import { submitOrder } from '../api/products'

const schema = z.object({
  name: z.string().min(2, 'Введите имя'),
  email: z.string().email('Неверный формат email'),
  phone: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const WarnIcon = ({ className = 'w-3 h-3 shrink-0' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
  </svg>
)

export default function OrderForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const clientId = useClientId()
  const { items } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [done, setDone] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setServerError('')
    try {
      await submitOrder({ ...data, clientId, items })
      setDone(true)
      setTimeout(onSuccess, 2000)
    } catch {
      setServerError('Ошибка отправки. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div>
          <p className="font-bold text-slate-800 text-base">Заявка принята!</p>
          <p className="text-sm text-slate-400 mt-1">Менеджер свяжется с вами в течение рабочего дня</p>
        </div>
      </div>
    )
  }

  const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-shadow placeholder:text-slate-300"

  return (
    <div className="flex flex-col flex-1 px-5 py-4 overflow-y-auto scrollbar-thin">
      <button onClick={onBack} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 text-sm mb-5 transition-colors group">
        <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
        Назад
      </button>

      <h3 className="font-bold text-slate-800 mb-0.5">Оформление заявки</h3>
      <p className="text-xs text-slate-400 mb-5">
        {items.length} {items.length === 1 ? 'позиция' : items.length < 5 ? 'позиции' : 'позиций'} · менеджер уточнит детали поставки
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 flex-1">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Контактное лицо</label>
          <input {...register('name')} placeholder="Иванов Иван Иванович" className={inputCls} />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <WarnIcon />{errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
          <input {...register('email')} type="email" placeholder="ivanov@company.ru" className={inputCls} />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
              <WarnIcon />{errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">
            Телефон <span className="text-slate-300 font-normal">(необязательно)</span>
          </label>
          <input {...register('phone')} type="tel" placeholder="+7 (999) 000-00-00" className={inputCls} />
        </div>

        {serverError && (
          <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3.5 py-2.5 flex items-center gap-2">
            <WarnIcon className="w-4 h-4 shrink-0" />{serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-auto w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-xl font-semibold text-sm hover:from-amber-600 hover:to-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-amber-200 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Отправка...
            </>
          ) : 'Отправить заявку'}
        </button>
      </form>
    </div>
  )
}
