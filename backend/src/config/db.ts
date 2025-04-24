import { validatedEnv } from '@src/lib'
import { drizzle } from 'drizzle-orm/node-postgres'

const db = drizzle(validatedEnv.DB_URL, { logger: !validatedEnv.IS_PRODUCTION })

export default db
