import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useClientId } from '../hooks/useClientId'
import type { Product } from '../types'

const apiBase = import.meta.env.VITE_API_BASE ?? ''

export const useProducts = (filters: { category?: string; search?: string } = {}) => {
  const clientId = useClientId()
  return useQuery({
    queryKey: ['products', clientId, filters],
    queryFn: async () => {
      const { data } = await axios.get<Product[]>(`${apiBase}/api/public/products`, {
        params: { clientId, ...filters },
      })
      return data
    },
  })
}

export const useProduct = (id: string) => {
  const clientId = useClientId()
  return useQuery({
    queryKey: ['product', id, clientId],
    queryFn: async () => {
      const { data } = await axios.get<Product>(`${apiBase}/api/public/products/${id}`, { params: { clientId } })
      return data
    },
    enabled: !!id,
  })
}

export const submitOrder = async (order: object) => {
  const { data } = await axios.post(`${apiBase}/api/public/orders`, order)
  return data
}
