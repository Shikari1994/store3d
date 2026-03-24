export interface Product {
  id: string
  clientId: string
  name: string
  description?: string
  price?: number
  category?: string
  modelUrl?: string
  imageUrl?: string
  photos?: string[]
  isActive: boolean
}
