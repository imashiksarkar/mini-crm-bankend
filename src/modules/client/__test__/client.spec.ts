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

  it('should be able to update own client', async () => {
    const user = await request(app).post('/auth/signup').send(cred)
    const [accessToken] = user.headers['set-cookie']
    const client = await request(app)
      .post('/clients')
      .set('Cookie', accessToken)
      .send(data)
    const clientId = client.body.data.id

    const newData: CreateClientDto = {
      name: 'Ashik Saaa',
      email: 'ashaaaik@gmaaail.com',
      phone: '0123456789cg0',
      company: 'ashiaaak',
    }
    const res = await request(app)
      .put(`/clients/${clientId}`)
      .set('Cookie', accessToken)
      .send(newData)

    expect(res.body.success).toBe(true)
    expect(res.body.code).toBe(200)
    expect(client.body.data.name).not.toBe(res.body.data.name)
    expect(res.body.data).toBeDefined()
    expect(res.body.data).toMatchObject(newData)
  })

  it('should not allow the user to update a client from another user', async () => {
    const user1 = await request(app).post('/auth/signup').send(cred)
    const [accessToken] = user1.headers['set-cookie']
    const client = await request(app)
      .post('/clients')
      .set('Cookie', accessToken)
      .send(data)
    const clientId = client.body.data.id

    cred.email = 'ashik2@gmail.com'
    cred.password = 'amlj5Ant@'
    const user2 = await request(app).post('/auth/signup').send(cred)
    const [accessToken2] = user2.headers['set-cookie']

    const newData: CreateClientDto = {
      name: 'Ashik Saaa',
      email: 'ashaaaik@gmaaail.com',
      phone: '0123456789cg0',
      company: 'ashiaaak',
    }

    const res = await request(app)
      .put(`/clients/${clientId}`)
      .set('Cookie', accessToken2)
      .send(newData)

    expect(res.body.success).toBe(false)
    expect(res.body.code).toBe(404)
    expect(res.body.error.message.join(',')).toMatch(/not found/gi)
  })

  it('should be able to delete own client', async () => {
    const user1 = await request(app).post('/auth/signup').send(cred)
    const [accessToken] = user1.headers['set-cookie']
    const client = await request(app)
      .post('/clients')
      .set('Cookie', accessToken)
      .send(data)
    const clientId = client.body.data.id

    const res = await request(app)
      .delete(`/clients/${clientId}`)
      .set('Cookie', accessToken)

    expect(res.body.success).toBe(true)
    expect(res.body.code).toBe(200)
    expect(res.body.message.join(',')).toMatch(/deleted/gi)
  })

  it('should not be able to delete a client from another user', async () => {
    const user1 = await request(app).post('/auth/signup').send(cred)
    const [accessToken] = user1.headers['set-cookie']
    const client = await request(app)
      .post('/clients')
      .set('Cookie', accessToken)
      .send(data)
    const clientId = client.body.data.id

    cred.email = 'ashik2@gmail.com'
    cred.password = 'amlj5Ant@'
    const user2 = await request(app).post('/auth/signup').send(cred)
    const [accessToken2] = user2.headers['set-cookie']

    const res = await request(app)
      .delete(`/clients/${clientId}`)
      .set('Cookie', accessToken2)

    expect(res.body.success).toBe(false)
    expect(res.body.code).toBe(404)
    expect(res.body.error.message.join(',')).toMatch(/not found/gi)
  })

  it('should be able to view own client', async () => {
    const user = await request(app).post('/auth/signup').send(cred)
    const [accessToken] = user.headers['set-cookie']
    const createdClient = await request(app)
      .post('/clients')
      .set('Cookie', accessToken)
      .send(data)
    const clientId = createdClient.body.data.id

    const res = await request(app)
      .get(`/clients/${clientId}`)
      .set('Cookie', accessToken)

    expect(res.body.data).toEqual(createdClient.body.data)
  })

  it.todo('should be able to list own clients', async () => {})
})
