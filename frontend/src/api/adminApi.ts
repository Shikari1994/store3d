import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

export const adminApi = axios.create({ baseURL: import.meta.env.VITE_API_BASE ?? '' })

adminApi.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
