import type { FastifyPluginAsync } from 'fastify'
import { getDb } from '../db.js'

interface OrderItem {
  productId: string
  name: string
  qty: number
  price?: number
}

interface Order {
  id: string
  clientId: string
  name: string
  email: string
  phone?: string
  items: OrderItem[]
  createdAt: string
}

export const ordersRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: Omit<Order, 'id' | 'createdAt'> }>(
    '/orders',
    async (req, reply) => {
      const db = await getDb()
      const newOrder: Order = {
        ...req.body,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      await db.collection('orders').insertOne(newOrder)
      return reply.status(201).send(newOrder)
    }
  )
}
