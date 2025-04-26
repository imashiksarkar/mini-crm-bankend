import { Client } from 'pg'
import { validatedEnv } from '@src/lib'
import {
  drizzle,
  NodePgClient,
  NodePgDatabase,
} from 'drizzle-orm/node-postgres'

type DbType = NodePgDatabase<Record<string, never>> & {
  $client: NodePgClient
}

export default class DB {
  private static _db: DbType | null = null

  static async connect(connectionString: string): Promise<void> {
    if (this._db) {
      console.info('Database already connected')
      return
    }

    try {
      const client = new Client({ connectionString })
      await client.connect()
      await client.query('SELECT 1')

      const db = drizzle(client, {
        logger: validatedEnv.IS_DEVELOPMENT,
      })

      ;(db as DbType).$client = client

      this._db = db as DbType
      console.info('Database connected')
    } catch (error) {
      console.error('Failed to connect to the database:', error)
      throw error
    }
  }

  static get $(): DbType {
    if (!this._db) {
      throw new Error('Database not connected. Call DB.connect() first.')
    }
    return this._db
  }
}
