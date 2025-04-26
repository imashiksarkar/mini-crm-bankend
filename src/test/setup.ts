import { DB } from '@src/config'
import { validatedEnv } from '@src/lib'
import { tokensTable, usersTable } from '@src/modules/auth/db/schema'
import { clientsTable } from '@src/modules/client/db/schema'
import { beforeEach } from 'vitest'

DB.connect(validatedEnv.DB_URL) // connect to test database

beforeEach(async () => {
  await DB.$.delete(tokensTable)
  await DB.$.delete(usersTable)
  await DB.$.delete(clientsTable)
})
