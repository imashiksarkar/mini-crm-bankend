import { DB } from '@src/config'
import { and, eq } from 'drizzle-orm'
import { CreateClientDto, UpdateClientDto } from './client.dtos'
import { clientsTable } from './db/schema'
import { response } from '@src/lib'

export default class AuthService {
  static readonly createClient = async (
    userId: string,
    clientAttr: CreateClientDto
  ) => {
    const [client] = await DB.$.insert(clientsTable)
      .values([
        {
          userId,
          ...clientAttr,
        },
      ])
      .returning()

    return client
  }

  static readonly updateClient = async (
    clientId: string,
    userId: string,
    clientAttr: UpdateClientDto
  ) => {
    const [client = undefined] = await DB.$.update(clientsTable)
      .set(clientAttr)
      .where(
        and(eq(clientsTable.id, clientId), eq(clientsTable.userId, userId))
      )
      .returning()

    if (!client) throw response().error(404).message('Client not found').exec()

    return client
  }

  static readonly deleteClient = async (clientId: string, userId: string) => {
    const [client = undefined] = await DB.$.delete(clientsTable)
      .where(
        and(eq(clientsTable.id, clientId), eq(clientsTable.userId, userId))
      )
      .returning()

    if (!client) throw response().error(404).message('Client not found').exec()

    return client
  }
}
