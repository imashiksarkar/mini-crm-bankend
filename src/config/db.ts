import * as authSchema from '@modules/auth/db/schema'
import * as clientSchema from '@modules/client/db/schema'
import * as projectSchema from '@modules/project/db/schema'
import { validatedEnv } from '@src/lib'
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Client } from 'pg'

export default class DB {
  private static readonly schema = {
    ...authSchema,
    ...clientSchema,
    ...projectSchema,
  }

  private static _db: NodePgDatabase<typeof this.schema> | null | undefined

  static async connect(connectionString: string) {
    if (this._db !== undefined) return
    this._db = null

    const client = new Client({ connectionString })
    await client.connect()
    await client.query('SELECT 1')

    const db = drizzle(client, {
      logger: validatedEnv.IS_DEVELOPMENT,
      schema: this.schema,
    })

    db.$client = client

    this._db = db

    console.info('Database connected')
  }

  static get instance() {
    if (!this._db)
      throw new Error('Database not connected. Call DB.connect() first.')

    return this._db
  }
}
