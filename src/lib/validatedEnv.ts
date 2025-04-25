import { config } from 'dotenv'
import z from 'zod'

config({
  path: './.env.local',
})

const validatedEnv = z
  .object({
    ENV: z
      .enum(['development', 'test', 'production', 'dev', 'prod'])
      .default('test'),
    PORT: z.coerce.number().default(3000),
    JWT_SECRET: z.string().trim().min(2),
    DB_URL: z.string().trim().min(2),
    ACC_TOKEN_EXP: z.coerce.number(),
    REF_TOKEN_EXP: z.coerce.number(),
  })
  .transform((oldEnvs) => ({
    ...oldEnvs,
    IS_PRODUCTION: oldEnvs.ENV === 'production' || oldEnvs.ENV === 'prod',
    IS_DEVELOPMENT: oldEnvs.ENV === 'development' || oldEnvs.ENV === 'dev',
    IS_TEST: oldEnvs.ENV === 'test',
  }))

export default validatedEnv.parse(process.env)
