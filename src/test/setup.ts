import { beforeEach } from 'vitest'
import { DB } from '@src/config'
import { tokensTable, usersTable } from '@src/modules/auth/db/schema'
import { validatedEnv } from '@src/lib'

process.env.ENV = 'test'
DB.connect(validatedEnv.DB_URL) // connect to test database

beforeEach(async () => {
  await DB.$.delete(tokensTable)
  await DB.$.delete(usersTable)
})
