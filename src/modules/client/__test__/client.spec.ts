import appPromise from '@src/app'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { CreateClientDto } from '../client.dtos'

describe('client', async () => {
  const app = await appPromise

  const cred = {
    name: 'Ashik S',
    email: 'ashik@gmail.com',
    password: 'A5shiklngya',
    role: ['admin'],
  }

  const data: CreateClientDto = {
    name: 'Ashik S',
    email: 'ashik@gmail.com',
    phone: '01234567890',
    company: 'ashik',
    notes: 'ashik',
  }

  it('should be able to create own client', async () => {
    const user = await request(app).post('/auth/signup').send(cred)
    const [accessToken] = user.headers['set-cookie']

    const res = await request(app)
      .post('/clients')
      .set('Cookie', accessToken)
      .send(data)

    expect(res.body.success).toBe(true)
    expect(res.body.code).toBe(201)
    expect(res.body.data).toBeDefined()
  })

  it('should allow to create duplicate client', async () => {
    const user = await request(app).post('/auth/signup').send(cred)
    const [accessToken] = user.headers['set-cookie']
    await request(app).post('/clients').set('Cookie', accessToken).send(data)

    const res = await request(app)
      .post('/clients')
      .set('Cookie', accessToken)
      .send(data)

    expect(res.body.success).toBe(false)
    expect(res.body.code).toBe(409)
    expect(res.body.data).not.toBeDefined()
  })

  it.todo('should be able to update own client', async () => {})
  it.todo('should be able to delete own client', async () => {})
  it.todo('should be able to view own client', async () => {})
  it.todo('should be able to list own clients', async () => {})
})
