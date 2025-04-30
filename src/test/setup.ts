import { DB } from '@src/config'
import { validatedEnv } from '@src/lib'
import { tokensTable, usersTable } from '@src/modules/auth/db/schema'
import { clientsTable } from '@src/modules/client/db/schema'
import { beforeAll, beforeEach } from 'vitest'

beforeAll(async () => {
  try {
    await DB.connect(validatedEnv.DB_URL)
  } catch (error) {
    console.log('Could not connect to database (setup)')
    process.exit(1)
  }
})

beforeEach(async () => {
  await DB.$.delete(tokensTable)
  await DB.$.delete(usersTable)
  await DB.$.delete(clientsTable)
})
