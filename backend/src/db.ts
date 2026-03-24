import 'dotenv/config'
import { MongoClient, type Db } from 'mongodb'

const uri = process.env.MONGODB_URI!
if (!uri) throw new Error('MONGODB_URI is not set')

let client: MongoClient
let db: Db

export async function getDb(): Promise<Db> {
  if (!db) {
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    })
    await client.connect()
    db = client.db('store3d')
  }
  return db
}
