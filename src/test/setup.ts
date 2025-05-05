import { DB } from '@src/config'
import { tokensTable, usersTable } from '@src/modules/auth/db/schema'
import { clientsTable } from '@src/modules/client/db/schema'
import { projectsTable } from '@src/modules/project/db/schema'
import { beforeAll, beforeEach } from 'vitest'

const db = DB.connect(
  'postgresql://testuser:testpassword@localhost:5432/minicrm?schema=public'
)

beforeAll(async () => {
  try {
    await db
  } catch (error) {
    console.log('Could not connect to database (setup)')
    process.exit(1)
  }
})

beforeEach(async () => {
  await DB.instance.delete(tokensTable)
  await DB.instance.delete(usersTable)
  await DB.instance.delete(clientsTable)
  await DB.instance.delete(projectsTable)
})
