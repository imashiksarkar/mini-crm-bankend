import appPromisse from '@src/app'
import { Hashing } from '@src/lib'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { signupUserDto } from '../auth.dtos'
import authService from '../auth.service'

describe('auth', async () => {
  const app = await appPromisse

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
      .expect(200)

    expect(res.headers['set-cookie']).toEqual([
      'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ])
  })

  it('should return all roles', async () => {
    const res = await request(app).get('/auth/roles').send(cred).expect(200)
    console.log('Here are all the allowed roles', res.body.data)
  })

  it('allows admin to change the user role', async () => {
    const user = await request(app).post('/auth/signup').send(cred).expect(201)

    // change user role using service
    await authService.changeRole({
      email: user.body.data.email,
      role: ['admin'],
    })

    // signin as admin
    const admin = await request(app).post('/auth/signin').send(cred).expect(200)
    const [adminAccessToken] = admin.headers['set-cookie']

    cred.role = ['user', 'admin']
    const res = await request(app)
      .patch('/auth/roles')
      .set('Cookie', adminAccessToken)
      .send(cred)

    expect(res.body.success).toBe(true)
  })

  it('disallows user to change the user role', async () => {
    cred.role = ['user']
    const user = await request(app).post('/auth/signup').send(cred).expect(201)

    const [accessToken] = user.headers['set-cookie']

    cred.role = ['admin', 'user']
    const res = await request(app)
      .patch('/auth/roles')
      .set('Cookie', accessToken)
      .send(cred)

    expect(res.body.success).toBe(false)
    expect(res.body.error.message[0]).toMatch(/not allowed/gi)
  })

  it('should not allow empty role', async () => {
    const user = await request(app).post('/auth/signup').send(cred).expect(201)

    // change user role using service
    await authService.changeRole({
      email: user.body.data.email,
      role: ['admin'],
    })

    // signin as admin
    const admin = await request(app).post('/auth/signin').send(cred).expect(200)
    const [adminAccessToken] = admin.headers['set-cookie']

    cred.role = []
    const res = await request(app)
      .patch('/auth/roles')
      .set('Cookie', adminAccessToken)
      .send(cred)

    expect(res.body.success).toBe(false)
    expect(res.body.error.message[0]).toMatch(/required/gi)
  })

  it('lets usr to refresh token', async () => {
    cred.role = ['admin']
    const user = await request(app).post('/auth/signup').send(cred).expect(201)

    const [_, refreshToken] = user.headers['set-cookie']

    const res = await request(app)
      .post('/auth/refresh')
      .set('Cookie', refreshToken)

    expect(res.body.success).toBe(true)
  })
})
