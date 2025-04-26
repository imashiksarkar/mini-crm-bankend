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

    expect(res.body.data).toBeDefined()
  })

  it('should not be able to create project for other client', async () => {
    // create user
    const user1 = await request(app).post('/auth/signup').send(cred)
    const [user1AccessToken] = user1.headers['set-cookie']

    cred.email = 'ashik2@gmail.com'
    const user2 = await request(app).post('/auth/signup').send(cred)
    const [user2AccessToken] = user2.headers['set-cookie']

    // create client for user1
    const user1CreatedClient = await request(app)
      .post('/clients')
      .set('Cookie', user1AccessToken)
      .send({
        email: 'ashik@gmail.com',
        name: 'ashik',
        phone: '01234567890',
      } satisfies CreateClientDto)

    data.clientId = user1CreatedClient.body.data.id

    // create project for client of user1 with user2 access token
    const res = await request(app)
      .post('/projects')
      .set('Cookie', user2AccessToken)
      .send(data)

    expect(res.body.code).toBe(401)
  })

  it('should be able to update own project', async () => {
    // create user
    const user = await request(app).post('/auth/signup').send(cred)
    const [accessToken] = user.headers['set-cookie']

    const client = await request(app)
      .post('/clients')
      .set('Cookie', accessToken)
      .send({
        email: 'ashik@gmail.com',
        name: 'ashik',
        phone: '01234567890',
      } satisfies CreateClientDto)
      .expect(201)

    data.clientId = client.body.data.id

    const project = await request(app)
      .post('/projects')
      .set('Cookie', accessToken)
      .send(data)
    const projectId = project.body.data.id as string

    data.status = 'in-progress'
    const updatedProject = await request(app)
      .patch(`/projects/${projectId}`)
      .set('Cookie', accessToken)
      .send(data)

    expect(updatedProject.body.success).toBe(true)
    expect(updatedProject.body.data).toBeDefined()
  })

  it("should not be able to update others' project", async () => {
    const user = await request(app).post('/auth/signup').send(cred)
    const [accessToken] = user.headers['set-cookie']

    cred.email = 'ashik20@gmail.com'
    const user2 = await request(app).post('/auth/signup').send(cred)
    const [accessToken2] = user2.headers['set-cookie']

    const client = await request(app)
      .post('/clients')
      .set('Cookie', accessToken)
      .send({
        email: 'ashik@gmail.com',
        name: 'ashik',
        phone: '01234567890',
      } satisfies CreateClientDto)
      .expect(201)

    data.clientId = client.body.data.id

    const project = await request(app)
      .post('/projects')
      .set('Cookie', accessToken)
      .send(data)
    const projectId = project.body.data.id as string

    data.status = 'in-progress'
    const updatedProject = await request(app)
      .patch(`/projects/${projectId}`)
      .set('Cookie', accessToken2)
      .send(data)

    expect(updatedProject.body.success).toBe(false)
    expect(updatedProject.body.error.message.join(',')).toMatch(
      /unauthorized/gi
    )
  })

  it('should be able to delete own project', async () => {
    const user = await request(app).post('/auth/signup').send(cred)
    const [accessToken] = user.headers['set-cookie']

    const client = await request(app)
      .post('/clients')
      .set('Cookie', accessToken)
      .send({
        email: 'ashik@gmail.com',
        name: 'ashik',
        phone: '01234567890',
      } satisfies CreateClientDto)
      .expect(201)

    data.clientId = client.body.data.id

    const project = await request(app)
      .post('/projects')
      .set('Cookie', accessToken)
      .send(data)
    const projectId = project.body.data.id as string

    const deletedProject = await request(app)
      .delete(`/projects/${projectId}`)
      .set('Cookie', accessToken)
      .send(data)

    expect(deletedProject.body.success).toBe(true)
    expect(deletedProject.body.data.id).toBe(projectId)
  })

  it("should not be able to delete others' project", async () => {
    const user = await request(app).post('/auth/signup').send(cred)
    const [accessToken] = user.headers['set-cookie']

    cred.email = 'ashik4@gmail.com'
    const user4 = await request(app).post('/auth/signup').send(cred)
    const [accessToken4] = user4.headers['set-cookie']

    const client = await request(app)
      .post('/clients')
      .set('Cookie', accessToken)
      .send({
        email: 'ashik@gmail.com',
        name: 'ashik',
        phone: '01234567890',
      } satisfies CreateClientDto)
      .expect(201)

    data.clientId = client.body.data.id

    const project = await request(app)
      .post('/projects')
      .set('Cookie', accessToken)
      .send(data)
    const projectId = project.body.data.id as string

    const deletedProject = await request(app)
      .delete(`/projects/${projectId}`)
      .set('Cookie', accessToken4)
      .send(data)

    expect(deletedProject.body.success).toBe(false)
    expect(deletedProject.body.error.message.join(',')).toMatch(/not found/gi)
  })
})
