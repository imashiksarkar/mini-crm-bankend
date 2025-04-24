import { defineConfig } from 'drizzle-kit'
import { validatedEnv } from './src/lib'

export default defineConfig({
  out: './migrations',
  schema: ['./src/modules/auth/db/schema/index.ts'],
  dialect: 'postgresql',
  dbCredentials: {
    url: validatedEnv.DB_URL,
  },
})
