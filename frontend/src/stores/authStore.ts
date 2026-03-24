import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

interface AuthState {
  token: string | null
  clientId: string | null
  clientName: string | null
  login: (clientId: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      clientId: null,
      clientName: null,
      login: async (clientId, password) => {
        const { data } = await axios.post<{ token: string; clientId: string; clientName: string }>(
          '/api/auth/login',
          { clientId, password }
        )
        set({ token: data.token, clientId: data.clientId, clientName: data.clientName })
      },
      logout: () => set({ token: null, clientId: null, clientName: null }),
    }),
    { name: 'store3d-auth' }
  )
)
