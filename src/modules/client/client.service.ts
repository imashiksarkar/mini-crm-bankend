import { DB } from '@src/config'
import { CreateClientDto } from './client.dtos'
import { ClientSchema, clientsTable } from './db/schema'

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
}
