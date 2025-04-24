import { db } from '@src/config'
import { SignupUserDto } from './auth.dtos'
import { UserSchema, usersTable } from './db/schema'
import { DrizzleError } from 'drizzle-orm'

export default class AuthService {
  static readonly signup = async (
    userAttr: SignupUserDto
  ): Promise<UserSchema> => {
    try {
      const [data] = await db.insert(usersTable).values([userAttr]).returning()

      return data
    } catch (error) {
      if (error instanceof DrizzleError) throw error.message
      else if (error instanceof Error) throw error.message
      throw new Error('Something went wrong - auth service').message
    }
  }
}
