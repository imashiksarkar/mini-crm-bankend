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
    const data = await signupUserDto.parseAsync(cred)

    expect(data).toBeDefined()
  })

  it('verifies the password', async () => {
    const data = await signupUserDto.parseAsync(cred)

    expect(await Hashing.verify(cred.password, data.password)).toBe(true)
  })

  it('should be able to signup', async () => {
    const res = await request(app).post('/auth/signup').send(cred)

    expect(res.body.data.email).toBe(cred.email)
    expect(res.headers['set-cookie']).toHaveLength(2)
  })

  it('should be able to signin', async () => {
    await request(app).post('/auth/signup').send(cred).expect(201)
    const res = await request(app).post('/auth/signin').send(cred).expect(200)

    expect(res.headers['set-cookie']).toHaveLength(2)
    expect(res.body.data.email).toBe(cred.email)
  })
})
