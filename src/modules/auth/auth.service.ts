import { db } from '@src/config'
import { SignupUserDto } from './auth.dtos'
import { UserSchema, usersTable } from './db/schema'
import { DrizzleError, eq } from 'drizzle-orm'

export default class AuthService {
  static readonly signup = async (
    userAttr: SignupUserDto
  ): Promise<UserSchema> => {
    // check if user already exists
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userAttr.email))

    console.log({ existingUser })

    const [data] = await db.insert(usersTable).values([userAttr]).returning()

    return data
  }
}
