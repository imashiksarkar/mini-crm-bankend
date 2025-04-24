import { config } from 'dotenv'
import { beforeEach } from 'vitest'
import { db } from '@src/config'
import { usersTable } from '@src/modules/auth/db/schema'

config({
  path: './.env.test',
})

beforeEach(async () => {
  await db.delete(usersTable)
})
