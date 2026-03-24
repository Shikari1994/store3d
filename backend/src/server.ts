import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import staticFiles from '@fastify/static'
import { createApp } from './app.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = createApp()

app.register(staticFiles, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/',
})

try {
  await app.listen({ port: 3000, host: '0.0.0.0' })
  console.log('Backend running at http://localhost:3000')
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
