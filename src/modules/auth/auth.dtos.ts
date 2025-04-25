import { z } from 'zod'
import { Hashing } from '@src/lib'
import { userRoleEnum } from './db/schema'

export const signupUserDto = z.object({
  name: z.string(),
  email: z.string().email(),
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
  role: z.array(z.enum(userRoleEnum.enumValues).default('user')),
})

export const signinUserDto = z.object({
  email: z.string().email(),
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

export const changeUserRoleDto = z.object({
  email: z.string().email(),
  role: z.array(z.enum(userRoleEnum.enumValues).default('user')),
})

export type SignupUserDto = z.infer<typeof signupUserDto>
export type SigninUserDto = z.infer<typeof signinUserDto>
export type ChangeUserRoleDto = z.infer<typeof changeUserRoleDto>
