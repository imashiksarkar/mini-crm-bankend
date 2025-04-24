import { describe, expect, it } from 'vitest'
import { signupUserDto } from '../auth.dtos'
import { ZodError } from 'zod'
import { Hashing } from '../../../lib'

describe('auth', () => {
  const cred = {
    name: 'Ashik S',
    email: 'ashik@me.com',
    password: 'A5shiklngya',
    role: 'admin',
  }

  it('validate signup user dto', async () => {
    try {
      const data = await signupUserDto.parseAsync(cred)

      expect(data).toBeDefined()
    } catch (error) {
      if (error instanceof ZodError)
        console.log((error as ZodError).flatten().fieldErrors)
      console.log(error.message)
    }
  })

  it('verifies the password', async () => {
    try {
      const data = await signupUserDto.parseAsync(cred)

      expect(Hashing.verify(cred.password, data.password)).toBe(true)
    } catch (error) {
      if (error instanceof ZodError)
        console.log((error as ZodError).flatten().fieldErrors)

      console.log(error.message)
    }
  })
})
