import appPromise from '@src/app'
import {
  clientPayload,
  createClient,
  createProject,
  createUser,
  marioCred,
  pokimonCred,
  projectPayload,
} from '@src/test/utils'
import request from 'supertest'
import { describe, expect, it } from 'vitest'

describe('Project Module', async () => {
  const app = await appPromise

  describe('Role: User', async () => {
    it('should be able to create project for own client', async () => {
      const [pokimon, pokimonAT] = await createUser()

      const pokimonClient = await createClient(pokimonAT)

      const project = await createProject(pokimonClient.data.id, pokimonAT)

      expect(project.data).toBeDefined()
    })

    it('should not be able to create project for other client', async () => {
      const [_, pokimonAT] = await createUser()

      const [__, marioAT] = await createUser()

      const pokimonClient = await createClient(pokimonAT)

      // mario creating project for a client created by pokimon
      const createProjectRes = await createProject(
        pokimonClient.data.id,
        marioAT
      )

      expect(createProjectRes.code).toBe(401)
      expect(createProjectRes.error.message[0]).toMatch(/unauthorized/gi)
    })

    it('should be able to update own project', async () => {
      const [_, pokimonAT] = await createUser()

      const pokimonClient = await createClient(pokimonAT)

      const pokimonProject = await createProject(
        pokimonClient.data.id,
        pokimonAT
      )
      const projectId = pokimonProject.data.id

      const { clientId, ...updateProjectPayload } = projectPayload
      const updateProjectRes = await request(app)
        .patch(`/projects/${projectId}`)
        .set('Cookie', pokimonAT)
        .send({
          ...updateProjectPayload,
          status: 'in-progress',
        })

      expect(updateProjectRes.body.success).toBe(true)
      expect(updateProjectRes.body.data).toBeDefined()
    })

    // it("should not be able to update others' project", async () => {
    //   const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
    //   const [pokimonAT] = pokimon.headers['set-cookie']

    //   const mario = await request(app).post('/auth/signup').send(marioCred)
    //   const [marioAT] = mario.headers['set-cookie']

    //   const pokimonClient = await request(app)
    //     .post('/clients')
    //     .set('Cookie', pokimonAT)
    //     .send(clientPayload)
    //     .expect(201)

    //   projectPayload.clientId = pokimonClient.body.data.id

    //   const pokimonProject = await request(app)
    //     .post('/projects')
    //     .set('Cookie', pokimonAT)
    //     .send(projectPayload)
    //   const projectId = pokimonProject.body.data.id as string

    //   projectPayload.status = 'in-progress'
    //   const updateProjectRes = await request(app)
    //     .patch(`/projects/${projectId}`)
    //     .set('Cookie', marioAT)
    //     .send(projectPayload)

    //   expect(updateProjectRes.body.success).toBe(false)
    //   expect(updateProjectRes.body.error.message.join(',')).toMatch(
    //     /unauthorized/gi
    //   )
    // })

    // it('should be able to delete own project', async () => {
    //   const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
    //   const [pokimonAT] = pokimon.headers['set-cookie']

    //   const pokimonClient = await request(app)
    //     .post('/clients')
    //     .set('Cookie', pokimonAT)
    //     .send(clientPayload)
    //     .expect(201)

    //   projectPayload.clientId = pokimonClient.body.data.id

    //   const pokimonProject = await request(app)
    //     .post('/projects')
    //     .set('Cookie', pokimonAT)
    //     .send(projectPayload)
    //   const projectId = pokimonProject.body.data.id as string

    //   const deleteProjectRes = await request(app)
    //     .delete(`/projects/${projectId}`)
    //     .set('Cookie', pokimonAT)

    //   expect(deleteProjectRes.body.success).toBe(true)
    //   expect(deleteProjectRes.body.data.id).toBe(projectId)
    // })

    // it("should not be able to delete others' project", async () => {
    //   const pokimon = await request(app).post('/auth/signup').send(pokimonCred)
    //   const [pokimonAT] = pokimon.headers['set-cookie']

    //   const mario = await request(app).post('/auth/signup').send(marioCred)
    //   const [marioAT] = mario.headers['set-cookie']

    //   const pokimonClient = await request(app)
    //     .post('/clients')
    //     .set('Cookie', pokimonAT)
    //     .send(clientPayload)
    //     .expect(201)
    //   projectPayload.clientId = pokimonClient.body.data.id

    //   const createProjectRes = await request(app)
    //     .post('/projects')
    //     .set('Cookie', pokimonAT)
    //     .send(projectPayload)
    //     .expect(201)
    //   const projectId = createProjectRes.body?.data?.id as string

    //   const deleteProjectRes = await request(app)
    //     .delete(`/projects/${projectId}`)
    //     .set('Cookie', marioAT)
    //     .send(projectPayload)

    //   expect(deleteProjectRes.body.success).toBe(false)
    //   expect(deleteProjectRes.body.error.message.join(',')).toMatch(
    //     /not found/gi
    //   )
    // })
  })

  // describe('Role: Admin', async () => {})
})
