import { describe, expect, it } from 'vitest'
import { signupUserDto } from '../auth.dtos'
import { ZodError } from 'zod'
import { Hashing } from '@src/lib'
import app from '@src/app'
import request from 'supertest'

describe('auth', () => {
  const cred = {
    name: 'Ashik S',
    email: 'ashik@gmail.com',
    password: 'A5shiklngya',
    role: ['admin'],
  }

  it('validate signup user dto', async () => {
    try {
      const data = await signupUserDto.parseAsync(cred)

      expect(data).toBeDefined()
    } catch (error) {
      if (error instanceof ZodError)
        console.log((error as ZodError).flatten().fieldErrors)
      console.log(error)
    }
  })

  it('verifies the password', async () => {
    try {
      const data = await signupUserDto.parseAsync(cred)

      expect(await Hashing.verify(cred.password, data.password)).toBe(true)
    } catch (error) {
      if (error instanceof ZodError)
        console.log((error as ZodError).flatten().fieldErrors)

      console.log(error)
    }
  })

  it.only('should be able to signup', async () => {
    try {
      // await request(app).post('/auth/signup').send(cred)
      const res = await request(app).post('/auth/signup').send(cred)
      console.log('-----', res.body)
      // console.log('-----', res.headers['set-cookie'])
      // console.log('-----', (res.error as any).text)
    } catch (error) {
      console.log(error)
    }
  })
})
