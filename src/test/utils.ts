import getApp from '@src/app'
import AuthService from '@src/modules/auth/auth.service'
import { CreateClientDto } from '@src/modules/client/client.dtos'
import request from 'supertest'

export const pokimonCred = {
  name: 'Pokomin S',
  email: 'pokomin@gmail.com',
  password: 'A5shikadmin',
}

export const marioCred = {
  name: 'Mario R',
  email: 'amrio@gmail.com',
  password: 'A5shikmario',
}

export const clientPayload: CreateClientDto = {
  name: 'Client 1',
  email: 'client@gmail.com',
  phone: '01234567890',
  company: 'ashik', // optional
  notes: 'ashik', // optional
}

export const createAdminUser = async () => {
  const user = await request(await getApp)
    .post('/auth/signup')
    .send({ ...pokimonCred, email: `pokimin${genRandomString()}@gmail.com` })
    .expect(201)

  const email = user.body.data.email

  await AuthService.changeRole({
    email,
    role: ['admin'],
  })

  const admin = await request(await getApp)
    .post('/auth/signin')
    .send({ ...pokimonCred, email })
    .expect(200)

  const [adminAT, adminRT] = admin.headers['set-cookie']

  return [admin.body, adminAT, adminRT]
}

export const createUser = async () => {
  const user = await request(await getApp)
    .post('/auth/signup')
    .send({ ...pokimonCred, email: `pokimin${genRandomString()}@gmail.com` })
    .expect(201)

  const [userAT, userRT] = user.headers['set-cookie']

  return [user.body, userAT, userRT]
}

export const genRandomString = () => {
  return Math.random().toString(36).substring(2, 15)
}

export const createClient = async (userAT: string) => {
  const client = await request(await getApp)
    .post('/clients')
    .set('Cookie', userAT)
    .send({ ...clientPayload, email: `client${genRandomString()}@gmail.com` })
    .expect(201)

  return client.body
}
