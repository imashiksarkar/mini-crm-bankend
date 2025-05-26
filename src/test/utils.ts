import getApp from '@src/app'
import AuthService from '@src/modules/auth/auth.service'
import { CreateClientDto } from '@src/modules/client/client.dtos'
import { CreateProjectDto } from '@src/modules/project/project.dtos'
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

export const projectPayload: CreateProjectDto = {
  clientId: '',
  title: 'project-1',
  budget: 1000,
  deadline: new Date(Date.now() + 1000 * 60 * 60),
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

  const [adminAT, adminRT] = admin.headers['set-cookie']

  return [admin.body, adminAT, adminRT]
}

export const createUser = async () => {
  const user = await request(await getApp)
    .post('/auth/signup')
    .send({ ...pokimonCred, email: `pokimin${genRandomString()}@gmail.com` })

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

  return client.body
}

export const createProject = async (clientId: string, clientAT: string) => {
  const createProjectRes = await request(await getApp)
    .post('/projects')
    .set('Cookie', clientAT)
    .send({ ...projectPayload, clientId })

  return createProjectRes.body
}
