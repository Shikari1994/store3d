import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { productsPublicRoutes } from './routes/products.js'
import { ordersRoutes } from './routes/orders.js'
import { adminRoutes } from './routes/admin.js'
import { authRoutes } from './routes/auth.js'

export function createApp() {
  const app = Fastify({ logger: true })
  app.register(cors, { origin: true })
  app.register(multipart, { limits: { fileSize: 50 * 1024 * 1024 } })
  app.register(authRoutes, { prefix: '/api/auth' })
  app.register(productsPublicRoutes, { prefix: '/api/public' })
  app.register(ordersRoutes, { prefix: '/api/public' })
  app.register(adminRoutes, { prefix: '/api/admin' })
  return app
}
