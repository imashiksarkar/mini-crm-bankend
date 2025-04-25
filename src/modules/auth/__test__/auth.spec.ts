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

  it('should be able to signout', async () => {
    const user = await request(app).post('/auth/signup').send(cred).expect(201)
    const [accessToken, refreshToken] = user.headers['set-cookie']

    const res = await request(app)
      .delete('/auth/signout')
      .set('Cookie', refreshToken)
      .send(cred)
      .expect(200)

    expect(res.headers['set-cookie']).toEqual([
      'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ])
  })

  it('should return all roles', async () => {
    const user = await request(app).get('/auth/roles').send(cred).expect(200)

    console.log(user.body)
  })

  it.todo('admin can change user role', async () => {})

  it.todo('allows admin to change the user role', async () => {})

  it.todo('disallows user to change the user role', async () => {})
})
