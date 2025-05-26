import appPromise from '@src/app'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { CreateClientDto } from '../client.dtos'
import AuthService from '@src/modules/auth/auth.service'

describe('Client Module', async () => {
  const app = await appPromise

  const pokimonCred = {
    name: 'Pokomin S',
    email: 'pokomin@gmail.com',
    password: 'A5shikadmin',
  }

  const marioCred = {
    name: 'Mario R',
    email: 'amrio@gmail.com',
    password: 'A5shikmario',
  }

  const clientPayload: CreateClientDto = {
    name: 'Client 1',
    email: 'client@gmail.com',
    phone: '01234567890',
    company: 'ashik', // optional
    notes: 'ashik', // optional
  }

  const createAdminUser = async () => {
    const user = await request(app)
      .post('/auth/signup')
      .send({ ...pokimonCred, email: `pokimin${genRandomString()}@gmail.com` })
      .expect(201)

    const email = user.body.data.email

    await AuthService.changeRole({
      email,
      role: ['admin'],
    })

    const admin = await request(app)
      .post('/auth/signin')
      .send({ ...pokimonCred, email })
      .expect(200)

    const [adminAT, adminRT] = admin.headers['set-cookie']

    return [admin.body, adminAT, adminRT]
  }

  const createUser = async () => {
    const user = await request(app)
      .post('/auth/signup')
      .send({ ...pokimonCred, email: `pokimin${genRandomString()}@gmail.com` })
      .expect(201)

    const [userAT, userRT] = user.headers['set-cookie']

    return [user.body, userAT, userRT]
  }

  const genRandomString = () => {
    return Math.random().toString(36).substring(2, 15)
  }

  const createClient = async (userAT: string) => {
    const client = await request(app)
      .post('/clients')
      .set('Cookie', userAT)
      .send({ ...clientPayload, email: `client${genRandomString()}@gmail.com` })
      .expect(201)

    return client.body
  }

  describe('Role: User', () => {
    it('should be able to create own client', async () => {
      const pokimon = await request(app)
        .post('/auth/signup')
        .send(pokimonCred)
        .expect(201)
      const [pokimonAT] = pokimon.headers['set-cookie']

      const clientRes = await request(app)
        .post('/clients')
        .set('Cookie', pokimonAT)
        .send(clientPayload)

      expect(clientRes.body.success).toBe(true)
      expect(clientRes.body.code).toBe(201)
      expect(clientRes.body.data).toBeDefined()
    })

    it('should not allow to create duplicate client', async () => {
      const user = await request(app).post('/auth/signup').send(pokimonCred)
      const [accessToken] = user.headers['set-cookie']
      await request(app)
        .post('/clients')
        .set('Cookie', accessToken)
        .send(clientPayload)
        .expect(201)

      const clientRes = await request(app)
        .post('/clients')
        .set('Cookie', accessToken)
        .send(clientPayload)

      expect(clientRes.body.success).toBe(false)
      expect(clientRes.body.code).toBe(409)
      expect(clientRes.body.data).not.toBeDefined()
    })

    it('should be able to update own client', async () => {
      const newClientPayload: CreateClientDto = {
        name: 'Client 2',
        email: 'client2@gmail.com',
        phone: '01234567890',
        company: 'ashik', // optional
        notes: 'ashik', // optional
      }

      const user = await request(app).post('/auth/signup').send(pokimonCred)
      const [accessToken] = user.headers['set-cookie']
      const client = await request(app)
        .post('/clients')
        .set('Cookie', accessToken)
        .send(clientPayload)
      const clientId = client.body.data.id

      const updatedClientRes = await request(app)
        .put(`/clients/${clientId}`)
        .set('Cookie', accessToken)
        .send(newClientPayload)

      expect(updatedClientRes.body.success).toBe(true)
      expect(updatedClientRes.body.code).toBe(200)
      expect(client.body.data.name).not.toBe(updatedClientRes.body.data.name)
      expect(updatedClientRes.body.data).toBeDefined()
      expect(updatedClientRes.body.data).toMatchObject(newClientPayload)
    })

    it('should not allow the user to update a client from another user', async () => {
      const newClientPayload: CreateClientDto = {
        name: 'Client 2',
        email: 'client2@gmail.com',
        phone: '01234567890',
        company: 'ashik', // optional
        notes: 'ashik', // optional
      }

      const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
      const [pokimonAT] = pokimon.headers['set-cookie']
      const pokimonClient = await request(app)
        .post('/clients')
        .set('Cookie', pokimonAT)
        .send(clientPayload)
      const pokimonClientId = pokimonClient.body.data.id

      const mario = await request(app).post('/auth/signup').send(marioCred)
      const [marioAT] = mario.headers['set-cookie']

      // updating pokimon's client as mario
      const updateClientRes = await request(app)
        .put(`/clients/${pokimonClientId}`)
        .set('Cookie', marioAT)
        .send(newClientPayload)

      expect(updateClientRes.body.success).toBe(false)
      expect(updateClientRes.body.code).toBe(404)
      expect(updateClientRes.body.error.message.join(',')).toMatch(
        /not found/gi
      )
    })

    it('should be able to delete own client', async () => {
      const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
      const [pokimonAT] = pokimon.headers['set-cookie']
      const pokimonClinet = await request(app)
        .post('/clients')
        .set('Cookie', pokimonAT)
        .send(clientPayload)
      const pokimonClientId = pokimonClinet.body.data.id

      const updateClientRes = await request(app)
        .delete(`/clients/${pokimonClientId}`)
        .set('Cookie', pokimonAT)

      expect(updateClientRes.body.success).toBe(true)
      expect(updateClientRes.body.code).toBe(200)
      expect(updateClientRes.body.message.join(',')).toMatch(/deleted/gi)
    })

    it('should not be able to delete a client from another user', async () => {
      const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
      const [pokimonAT] = pokimon.headers['set-cookie']
      const pokimonClient = await request(app)
        .post('/clients')
        .set('Cookie', pokimonAT)
        .send(clientPayload)
      const pokimonClientId = pokimonClient.body.data.id

      const mario = await request(app).post('/auth/signup').send(marioCred)
      const [marioAT] = mario.headers['set-cookie']

      const deleteClientRes = await request(app)
        .delete(`/clients/${pokimonClientId}`)
        .set('Cookie', marioAT)

      expect(deleteClientRes.body.success).toBe(false)
      expect(deleteClientRes.body.code).toBe(404)
      expect(deleteClientRes.body.error.message.join(',')).toMatch(
        /not found/gi
      )
    })

    it('should be able to view own client', async () => {
      const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
      const [pokimonAT] = pokimon.headers['set-cookie']
      const pokimonClient = await request(app)
        .post('/clients')
        .set('Cookie', pokimonAT)
        .send(clientPayload)
      const pokimonClientId = pokimonClient.body.data.id

      const viewClientRes = await request(app)
        .get(`/clients/${pokimonClientId}`)
        .set('Cookie', pokimonAT)

      expect(viewClientRes.body.data).toEqual(pokimonClient.body.data)
    })

    it('should be able to list own clients', async () => {
      const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
      const [pokimonAT] = pokimon.headers['set-cookie']

      await request(app)
        .post('/clients')
        .set('Cookie', pokimonAT)
        .send(clientPayload)

      clientPayload.email = 'client2@gmail.com'
      await request(app)
        .post('/clients')
        .set('Cookie', pokimonAT)
        .send(clientPayload)

      clientPayload.email = 'client3@gmail.com'
      await request(app)
        .post('/clients')
        .set('Cookie', pokimonAT)
        .send(clientPayload)

      const listClientsRes = await request(app)
        .get(`/clients`)
        .set('Cookie', pokimonAT)

      expect(listClientsRes.body.success).toBe(true)
      expect(listClientsRes.body.code).toBe(200)
      expect(listClientsRes.body.data.length).toBe(3)
    })
  })

  describe('Role: Admin', () => {
    it('gets all clients of a user', async () => {
      const [user1, user1AT] = await createUser()
      await createClient(user1AT)
      await createClient(user1AT)
      await createClient(user1AT)
      await createClient(user1AT)
      await createClient(user1AT)

      const [_, user2AT] = await createUser()
      const [__, adminAT] = await createAdminUser()

      await request(app)
        .get(`/clients?userId=${user1.data.id}&as=admin`)
        .set('Cookie', user2AT)
        .expect(403)

      await request(app)
        .get(`/clients?userId=${user1.data.id}&as=admin`)
        .set('Cookie', adminAT)
        .expect(200)
    })

    it('can get client details of any user', async () => {
      const [_, user1AT] = await createUser()
      await createClient(user1AT)
      await createClient(user1AT)
      await createClient(user1AT)
      await createClient(user1AT)
      const c = await createClient(user1AT)

      const [__, user2AT] = await createUser()
      const [___, adminAT] = await createAdminUser()

      // can fetch own client detail
      await request(app)
        .get(`/clients/${c.data.id}`)
        .set('Cookie', user1AT)
        .expect(200)

      // can't fetch client detail of other user
      await request(app)
        .get(`/clients/${c.data.id}`)
        .set('Cookie', user2AT)
        .expect(404)

      // can fetch client detail of any user as admin
      await request(app)
        .get(`/clients/${c.data.id}?as=admin`)
        .set('Cookie', adminAT)
        .expect(200)
    })

    it('can delete client of any user', async () => {
      const [_, user1AT] = await createUser()
      await createClient(user1AT)
      const c = await createClient(user1AT)
      await createClient(user1AT)
      const c2 = await createClient(user1AT)
      await createClient(user1AT)

      const [__, user2AT] = await createUser()
      const [___, adminAT] = await createAdminUser()

      // can delete own client
      await request(app)
        .delete(`/clients/${c.data.id}`)
        .set('Cookie', user1AT)
        .expect(200)

      // can't delete other's client
      await request(app)
        .delete(`/clients/${c2.data.id}`)
        .set('Cookie', user2AT)
        .expect(404)

      // can delete other's client as admin
      await request(app)
        .delete(`/clients/${c2.data.id}?as=admin`)
        .set('Cookie', adminAT)
        .expect(200)
    })
  })
})
