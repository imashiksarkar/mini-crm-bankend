import { z } from 'zod'
import { Hashing } from '@src/lib'

export const signupUserDto = z.object({
  name: z.string(),
  email: z
    .string()
    .email()
    .transform((arg) => Hashing.hash(arg)),
  password: z
    .string()
    .min(6)
    .max(20)
    .refine(
      (arg) => {
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/
        return regex.test(arg)
      },
      {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      }
    )
    .transform(async (arg) => await Hashing.hash(arg)),
  role: z.enum(['user', 'admin']).default('user'),
})

export const signinUserDto = z.object({
  email: z
    .string()
    .email()
    .transform((arg) => Hashing.hash(arg)),
  password: z
    .string()
    .min(6)
    .max(20)
    .refine(
      (arg) => {
        const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/
        return regex.test(arg)
      },
      {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, and one number',
      }
    )
    .transform(async (arg) => await Hashing.hash(arg)),
})
