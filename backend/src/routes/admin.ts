import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify'
import { getDb } from '../db.js'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MODELS_DIR = path.join(__dirname, '..', '..', 'public', 'models')
const IMAGES_DIR = path.join(__dirname, '..', '..', 'public', 'images')

interface Product {
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

async function requireAuth(req: FastifyRequest, reply: FastifyReply) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Требуется авторизация' })
  }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { clientId: string }
    ;(req as FastifyRequest & { clientId: string }).clientId = payload.clientId
  } catch {
    return reply.status(401).send({ error: 'Токен недействителен или истёк' })
  }
}

export const adminRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', requireAuth)

  fastify.get('/products', async (req) => {
    const clientId = (req as FastifyRequest & { clientId: string }).clientId
    const db = await getDb()
    return db
      .collection<Product>('products')
      .find({ clientId }, { projection: { _id: 0 } })
      .toArray()
  })

  fastify.post<{ Body: Omit<Product, 'id'> }>('/products', async (req, reply) => {
    const clientId = (req as FastifyRequest & { clientId: string }).clientId
    const db = await getDb()
    const newProduct: Product = {
      ...req.body,
      clientId,
      id: Date.now().toString(),
      isActive: true,
    }
    await db.collection('products').insertOne(newProduct)
    return reply.status(201).send(newProduct)
  })

  fastify.put<{ Params: { id: string }; Body: Partial<Product> }>(
    '/products/:id',
    async (req, reply) => {
      const clientId = (req as FastifyRequest & { clientId: string }).clientId
      const db = await getDb()
      const { _id, ...update } = req.body as Partial<Product> & { _id?: unknown }
      const result = await db
        .collection<Product>('products')
        .findOneAndUpdate(
          { id: req.params.id, clientId },
          { $set: { ...update, clientId } },
          { returnDocument: 'after', projection: { _id: 0 } }
        )
      if (!result) return reply.status(404).send({ error: 'Not found' })
      return result
    }
  )

  fastify.delete<{ Params: { id: string } }>('/products/:id', async (req, reply) => {
    const clientId = (req as FastifyRequest & { clientId: string }).clientId
    const db = await getDb()
    const result = await db
      .collection<Product>('products')
      .deleteOne({ id: req.params.id, clientId })
    if (result.deletedCount === 0) return reply.status(404).send({ error: 'Not found' })
    return reply.status(204).send()
  })

  fastify.post<{ Params: { id: string } }>('/products/:id/model', async (req, reply) => {
    const data = await req.file()
    if (!data) return reply.status(400).send({ error: 'No file uploaded' })

    await mkdir(MODELS_DIR, { recursive: true })
    const filename = `${req.params.id}.glb`
    const buffer = await data.toBuffer()
    await writeFile(path.join(MODELS_DIR, filename), buffer)

    const modelUrl = `/models/${filename}`
    const db = await getDb()
    await db
      .collection<Product>('products')
      .updateOne({ id: req.params.id }, { $set: { modelUrl } })

    return { modelUrl }
  })

  fastify.post<{ Params: { id: string } }>('/products/:id/preview', async (req, reply) => {
    const data = await req.file()
    if (!data) return reply.status(400).send({ error: 'No file uploaded' })

    await mkdir(IMAGES_DIR, { recursive: true })
    const ext = path.extname(data.filename) || '.jpg'
    const filename = `${req.params.id}_preview${ext}`
    const buffer = await data.toBuffer()
    await writeFile(path.join(IMAGES_DIR, filename), buffer)

    const imageUrl = `/images/${filename}`
    const db = await getDb()
    await db
      .collection<Product>('products')
      .updateOne({ id: req.params.id }, { $set: { imageUrl } })

    return { imageUrl }
  })

  fastify.post<{ Params: { id: string } }>('/products/:id/photos', async (req, reply) => {
    const data = await req.file()
    if (!data) return reply.status(400).send({ error: 'No file uploaded' })

    await mkdir(IMAGES_DIR, { recursive: true })
    const ext = path.extname(data.filename) || '.jpg'
    const filename = `${req.params.id}_${Date.now()}${ext}`
    const buffer = await data.toBuffer()
    await writeFile(path.join(IMAGES_DIR, filename), buffer)

    const photoUrl = `/images/${filename}`
    const db = await getDb()
    await db
      .collection<Product>('products')
      .updateOne({ id: req.params.id }, { $push: { photos: photoUrl } })

    return { photoUrl }
  })

  fastify.delete<{ Params: { id: string }; Querystring: { url: string } }>(
    '/products/:id/photos',
    async (req, reply) => {
      const clientId = (req as FastifyRequest & { clientId: string }).clientId
      const { url } = req.query as { url: string }
      const db = await getDb()
      const result = await db
        .collection<Product>('products')
        .findOneAndUpdate(
          { id: req.params.id, clientId },
          { $pull: { photos: url } },
          { returnDocument: 'after', projection: { _id: 0 } }
        )
      if (!result) return reply.status(404).send({ error: 'Not found' })

      try {
        await unlink(path.join(IMAGES_DIR, path.basename(url)))
      } catch {}

      return { ok: true }
    }
  )
}
