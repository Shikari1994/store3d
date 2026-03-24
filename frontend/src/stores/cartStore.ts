import { create } from 'zustand'
import type { CartItem } from '../types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clear: () => void
  toggleCart: () => void
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return { items: [...state.items, item] }
    }),

  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

  updateQty: (productId, qty) =>
    set((state) => ({
      items: state.items.map((i) => (i.productId === productId ? { ...i, qty } : i)),
    })),

  clear: () => set({ items: [] }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
}))
