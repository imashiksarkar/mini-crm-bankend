import appPromise from '@src/app'
import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { CreateProjectDto } from '../project.dtos'
import { CreateClientDto } from '@src/modules/client/client.dtos'

describe('project', async () => {
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

  const projectPayload: CreateProjectDto = {
    clientId: '',
    title: 'project-1',
    budget: 1000,
    deadline: new Date(Date.now() + 1000 * 60 * 60),
  }

  it('should be able to create project for own client', async () => {
    const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
    const [pokimonAT] = pokimon.headers['set-cookie']

    const pokimonClient = await request(app)
      .post('/clients')
      .set('Cookie', pokimonAT)
      .send(clientPayload)
    projectPayload.clientId = pokimonClient.body.data.id

    const createProjectRes = await request(app)
      .post('/projects')
      .set('Cookie', pokimonAT)
      .send(projectPayload)

    expect(createProjectRes.body.data).toBeDefined()
  })

  it('should not be able to create project for other client', async () => {
    const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
    const [pokimonAT] = pokimon.headers['set-cookie']

    const mario = await request(app).post('/auth/signup').send(marioCred)
    const [marioAT] = mario.headers['set-cookie']

    const pokimonClient = await request(app)
      .post('/clients')
      .set('Cookie', pokimonAT)
      .send(clientPayload)
    projectPayload.clientId = pokimonClient.body.data.id

    // mario creating project for a client created by pokimon
    const createProjectRes = await request(app)
      .post('/projects')
      .set('Cookie', marioAT)
      .send(projectPayload)

    expect(createProjectRes.body.code).toBe(401)
    expect(createProjectRes.body.error.message[0]).toMatch(/unauthorized/gi)
  })

  it('should be able to update own project', async () => {
    const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
    const [pokimonAT] = pokimon.headers['set-cookie']

    const pokimonClient = await request(app)
      .post('/clients')
      .set('Cookie', pokimonAT)
      .send(clientPayload)
      .expect(201)

    projectPayload.clientId = pokimonClient.body.data.id

    const pokimonProject = await request(app)
      .post('/projects')
      .set('Cookie', pokimonAT)
      .send(projectPayload)
    const projectId = pokimonProject.body.data.id as string

    projectPayload.status = 'in-progress'
    const updateProjectRes = await request(app)
      .patch(`/projects/${projectId}`)
      .set('Cookie', pokimonAT)
      .send(projectPayload)

    expect(updateProjectRes.body.success).toBe(true)
    expect(updateProjectRes.body.data).toBeDefined()
  })

  it("should not be able to update others' project", async () => {
    const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
    const [pokimonAT] = pokimon.headers['set-cookie']

    const mario = await request(app).post('/auth/signup').send(marioCred)
    const [marioAT] = mario.headers['set-cookie']

    const pokimonClient = await request(app)
      .post('/clients')
      .set('Cookie', pokimonAT)
      .send(clientPayload)
      .expect(201)

    projectPayload.clientId = pokimonClient.body.data.id

    const pokimonProject = await request(app)
      .post('/projects')
      .set('Cookie', pokimonAT)
      .send(projectPayload)
    const projectId = pokimonProject.body.data.id as string

    projectPayload.status = 'in-progress'
    const updateProjectRes = await request(app)
      .patch(`/projects/${projectId}`)
      .set('Cookie', marioAT)
      .send(projectPayload)

    expect(updateProjectRes.body.success).toBe(false)
    expect(updateProjectRes.body.error.message.join(',')).toMatch(
      /unauthorized/gi
    )
  })

  it('should be able to delete own project', async () => {
    const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
    const [pokimonAT] = pokimon.headers['set-cookie']

    const pokimonClient = await request(app)
      .post('/clients')
      .set('Cookie', pokimonAT)
      .send(clientPayload)
      .expect(201)

    projectPayload.clientId = pokimonClient.body.data.id

    const pokimonProject = await request(app)
      .post('/projects')
      .set('Cookie', pokimonAT)
      .send(projectPayload)
    const projectId = pokimonProject.body.data.id as string

    const deleteProjectRes = await request(app)
      .delete(`/projects/${projectId}`)
      .set('Cookie', pokimonAT)

    expect(deleteProjectRes.body.success).toBe(true)
    expect(deleteProjectRes.body.data.id).toBe(projectId)
  })

  it("should not be able to delete others' project", async () => {
    const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
    const [pokimonAT] = pokimon.headers['set-cookie']

    const mario = await request(app).post('/auth/signup').send(marioCred)
    const [marioAT] = mario.headers['set-cookie']

    const pokimonClient = await request(app)
      .post('/clients')
      .set('Cookie', pokimonAT)
      .send(clientPayload)
      .expect(201)
    projectPayload.clientId = pokimonClient.body.data.id

    const createProjectRes = await request(app)
      .post('/projects')
      .set('Cookie', pokimonAT)
      .send(projectPayload)
      .expect(201)
    const projectId = createProjectRes.body?.data?.id as string

    const deleteProjectRes = await request(app)
      .delete(`/projects/${projectId}`)
      .set('Cookie', marioAT)
      .send(projectPayload)

    expect(deleteProjectRes.body.success).toBe(false)
    expect(deleteProjectRes.body.error.message.join(',')).toMatch(/not found/gi)
  })
})
