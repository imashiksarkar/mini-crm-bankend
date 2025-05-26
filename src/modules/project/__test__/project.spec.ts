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

    it("should not be able to update others' project", async () => {
      const [_, pokimonAT] = await createUser()

      const [__, marioAT] = await createUser()

      const pokimonClient = await createClient(pokimonAT)

      const pokimonProject = await createProject(
        pokimonClient.data.id,
        pokimonAT
      )

      const projectId = pokimonProject.data.id

      const { clientId, ...updateProjectPayload } = projectPayload
      const updateProjectRes = await request(app)
        .patch(`/projects/${projectId}`)
        .set('Cookie', marioAT)
        .send({ ...updateProjectPayload, status: 'in-progress' })

      expect(updateProjectRes.body.success).toBe(false)
      expect(updateProjectRes.body.error.message.join(',')).toMatch(
        /unauthorized/gi
      )
    })

    it('should be able to delete own project', async () => {
      const [_, pokimonAT] = await createUser()

      const pokimonClient = await createClient(pokimonAT)

      const pokimonProject = await createProject(
        pokimonClient.data.id,
        pokimonAT
      )
      const projectId = pokimonProject.data.id as string

      const deleteProjectRes = await request(app)
        .delete(`/projects/${projectId}`)
        .set('Cookie', pokimonAT)

      expect(deleteProjectRes.body.success).toBe(true)
      expect(deleteProjectRes.body.data.id).toBe(projectId)
    })

    it("should not be able to delete others' project", async () => {
      const [_, pokimonAT] = await createUser()
      const [__, marioAT] = await createUser()

      const pokimonClient = await createClient(pokimonAT)

      const createProjectRes = await createProject(
        pokimonClient.data.id,
        pokimonAT
      )
      const projectId = createProjectRes.data?.id as string

      const deleteProjectRes = await request(app)
        .delete(`/projects/${projectId}`)
        .set('Cookie', marioAT)
        .send(projectPayload)

      expect(deleteProjectRes.body.success).toBe(false)
      expect(deleteProjectRes.body.error.message.join(',')).toMatch(
        /not found/gi
      )
    })

    it('should be able to view own projects', async () => {
      const [_, pokimonAT] = await createUser()

      const pokimonClient = await createClient(pokimonAT)

      await createProject(pokimonClient.data.id, pokimonAT)
      await createProject(pokimonClient.data.id, pokimonAT)
      await createProject(pokimonClient.data.id, pokimonAT)

      const projects = await request(app)
        .get('/projects')
        .set('Cookie', pokimonAT)

      expect(projects.body.data).toBeDefined()
      expect(projects.body.data.length).toBe(3)
    })

    it('should be able to view own projects filtered by client', async () => {
      const [_, userAT] = await createUser()

      const clinet = await createClient(userAT)
      const client2 = await createClient(userAT)

      await createProject(clinet.data.id, userAT)
      await createProject(clinet.data.id, userAT)
      await createProject(clinet.data.id, userAT)
      await createProject(client2.data.id, userAT)
      await createProject(client2.data.id, userAT)

      const projects = await request(app)
        .get('/projects?clientId=' + client2.data.id)
        .set('Cookie', userAT)

      expect(projects.body.data).toBeDefined()
      expect(projects.body.data.length).toBe(2)
    })
  })

  // describe('Role: Admin', async () => {})
})
