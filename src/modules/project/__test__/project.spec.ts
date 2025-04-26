import appPromise from '@src/app'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { CreateProjectDto } from '../project.dtos'
import { CreateClientDto } from '@src/modules/client/client.dtos'

describe('client', async () => {
  const app = await appPromise

  const cred = {
    name: 'Ashik S',
    email: 'ashik@gmail.com',
    password: 'A5shiklngya',
    role: ['admin'],
  }

  const data: CreateProjectDto = {
    clientId: '',
    title: 'project-1',
    budget: 1000,
    deadline: new Date(Date.now() + 1000 * 60 * 60),
  }

  it('should be able to create project for own client', async () => {
    // create user
    const user = await request(app).post('/auth/signup').send(cred)
    const [accessToken] = user.headers['set-cookie']

    // create client
    const createdClient = await request(app)
      .post('/clients')
      .set('Cookie', accessToken)
      .send({
        email: 'ashik@gmail.com',
        name: 'ashik',
        phone: '01234567890',
      } satisfies CreateClientDto)

    data.clientId = createdClient.body.data.id

    // create project
    const res = await request(app)
      .post('/projects')
      .set('Cookie', accessToken)
      .send(data)

    console.log(res.body)
  })
})
