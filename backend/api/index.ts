import 'dotenv/config'
import { createApp } from '../src/app.js'
import type { IncomingMessage, ServerResponse } from 'node:http'

const app = createApp()

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await app.ready()
  app.server.emit('request', req, res)
}
