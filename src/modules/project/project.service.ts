import { DB } from '@src/config'
import { CreateProjectDto } from './project.dtos'
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
}
