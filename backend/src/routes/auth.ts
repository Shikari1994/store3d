import type { FastifyPluginAsync } from 'fastify'
import { getDb } from '../db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

interface Client {
  id: string
  name: string
  email: string
  password?: string
  passwordHash?: string
}

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Body: { clientId: string; password: string } }>(
    '/login',
    async (req, reply) => {
      const { clientId, password } = req.body
      const db = await getDb()
      const client = await db
        .collection<Client>('clients')
        .findOne({ id: clientId }, { projection: { _id: 0 } })

      if (!client) return reply.status(401).send({ error: 'Неверный логин или пароль' })

      // Auto-hash plaintext password on first login
      if (client.password && !client.passwordHash) {
        const hash = await bcrypt.hash(client.password, 10)
        await db
          .collection<Client>('clients')
          .updateOne({ id: clientId }, { $set: { passwordHash: hash }, $unset: { password: '' } })
        client.passwordHash = hash
      }

      if (!client.passwordHash) {
        return reply.status(401).send({ error: 'Пароль не задан для этого клиента' })
      }

      const valid = await bcrypt.compare(password, client.passwordHash)
      if (!valid) return reply.status(401).send({ error: 'Неверный логин или пароль' })

      const token = jwt.sign({ clientId: client.id }, JWT_SECRET, { expiresIn: '7d' })
      return { token, clientId: client.id, clientName: client.name }
    }
  )
}
