import z from 'zod'
import { config } from 'dotenv'

const env = z
  .object({
    ENV: z
      .enum(['development', 'test', 'production', 'dev', 'prod'])
      .default('test'),
  })
  .parse(process.env)

config({
  path: `./.env.${env.ENV === 'test' ? 'test' : 'local'}`,
})

const validatedEnv = z
  .object({
    ENV: z.enum(['development', 'test', 'production', 'dev', 'prod']),
    PORT: z.coerce.number().default(3000),
    JWT_SECRET: z.string().trim().min(2),
    DB_URL: z.string().trim().min(2),
    ACC_TOKEN_EXP: z.coerce.number(),
    REF_TOKEN_EXP: z.coerce.number(),
  })
  .transform((oldEnvs) => ({
    ...oldEnvs,
    IS_PRODUCTION: oldEnvs.ENV === 'production' || oldEnvs.ENV === 'prod',
  }))

export default validatedEnv.parse(process.env)
