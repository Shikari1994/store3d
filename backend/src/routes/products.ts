import type { FastifyPluginAsync } from 'fastify'
import { getDb } from '../db.js'

interface Product {
  id: string
  clientId: string
  name: string
  description?: string
  price?: number
  category?: string
  modelUrl?: string
  imageUrl?: string
  isActive: boolean
}

export const productsPublicRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get<{ Querystring: { clientId: string; category?: string; search?: string } }>(
    '/products',
    async (req) => {
      const { clientId, category, search } = req.query
      const db = await getDb()
      const query: Record<string, unknown> = { clientId, isActive: true }
      if (category) query.category = category
      if (search) query.name = { $regex: search, $options: 'i' }
      return db.collection<Product>('products').find(query, { projection: { _id: 0 } }).toArray()
    }
  )

  fastify.get<{ Params: { id: string }; Querystring: { clientId: string } }>(
    '/products/:id',
    async (req, reply) => {
      const db = await getDb()
      const product = await db
        .collection<Product>('products')
        .findOne({ id: req.params.id, clientId: req.query.clientId }, { projection: { _id: 0 } })
      if (!product) return reply.status(404).send({ error: 'Not found' })
      return product
    }
  )
}
