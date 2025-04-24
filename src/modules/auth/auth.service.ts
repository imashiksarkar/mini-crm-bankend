import { db } from '@src/config'
import { SignupUserDto } from './auth.dtos'
import { UserSchema, usersTable } from './db/schema'
import { DrizzleError, eq } from 'drizzle-orm'
import { response } from '@src/lib'

export default class AuthService {
  static readonly signup = async (
    userAttr: SignupUserDto
  ): Promise<UserSchema> => {
    const [data1] = await db.insert(usersTable).values([userAttr]).returning()
    // check if user already exists
    const [existingUser = null] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userAttr.email))

    if (existingUser)
      throw response().error(409).message('User already exists').exec()

    const [data] = await db.insert(usersTable).values([userAttr]).returning()

    // console.log({ existingUser })

    return data
  }
}
