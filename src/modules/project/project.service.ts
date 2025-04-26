import { DB } from '@src/config'
import { CreateProjectDto, UpdateProjectDto } from './project.dtos'
import { projectsTable } from './db/schema'
import { response } from '@src/lib'
import { and, eq, sql } from 'drizzle-orm'
import { clientsTable } from '@modules/client/db/schema'

export default class ProjectService {
  static readonly createProject = async (
    userId: string,
    projectAttr: CreateProjectDto
  ) => {
    // does the project belong to same user client
    const [client = undefined] = await DB.$.select()
      .from(clientsTable)
      .where(
        and(
          eq(sql`${userId}`, clientsTable.userId),
          eq(clientsTable.id, sql`${projectAttr.clientId}`)
        )
      )

    if (!client)
      throw response()
        .error(401)
        .message('Unauthorized to create project')
        .exec()

    const [project = undefined] = await DB.$.insert(projectsTable)
      .values([
        {
          userId,
          ...projectAttr,
        },
      ])
      .returning()

    if (!project)
      throw response().error(500).message('Failed to create project').exec()

    return project
  }

  static readonly updateProject = async (
    projectId: string,
    userId: string,
    projectAttr: UpdateProjectDto
  ) => {
    // does the project belong to same user client
    const [client = undefined] = await DB.$.select()
      .from(clientsTable)
      .where(and(eq(sql`${userId}`, clientsTable.userId)))

    if (!client)
      throw response()
        .error(401)
        .message('Unauthorized to update project')
        .exec()

    const [project = undefined] = await DB.$.update(projectsTable)
      .set(projectAttr)
      .where(eq(projectsTable.id, projectId))
      .returning()

    if (!project)
      throw response().error(404).message('Project not found').exec()

    return project
  }

  static readonly deleteProject = async (projectId: string, userId: string) => {
    const [project = undefined] = await DB.$.delete(projectsTable)
      .where(
        and(eq(projectsTable.id, projectId), eq(projectsTable.userId, userId))
      )
      .returning()

    if (!project)
      throw response().error(404).message('Project not found').exec()

    return project
  }
}
