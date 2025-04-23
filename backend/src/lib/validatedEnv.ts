import z from 'zod'

const validatedEnv = z.object({
  ENV: z.enum(['development', 'test', 'production', 'dev', 'prod']),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string(),
})

export default validatedEnv.parse(process.env)
