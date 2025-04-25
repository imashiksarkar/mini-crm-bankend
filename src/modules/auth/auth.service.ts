import { db } from '@src/config'
import { jwt, response, validatedEnv } from '@src/lib'
import { eq } from 'drizzle-orm'
import { SigninUserDto, SignupUserDto } from './auth.dtos'
import { tokensTable, usersTable } from './db/schema'

export default class AuthService {
  static readonly signup = async (userAttr: SignupUserDto) => {
    const [existingUser = null] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userAttr.email))

    if (existingUser)
      throw response().error(409).message('User already exists').exec()

    const [user] = await db.insert(usersTable).values([userAttr]).returning({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      role: usersTable.role,
    })

    const accessToken = await jwt.createAccessToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    const refreshToken = await jwt.createRefreshToken({
      id: user.id,
    })

    // save refresh token to db
    await db.insert(tokensTable).values([
      {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(validatedEnv.REF_TOKEN_EXP),
      },
    ])

    return {
      ...user,
      token: {
        accessToken,
        refreshToken,
      },
    }
  }

  static readonly signin = async (userAttr: SigninUserDto) => {
    const [existingUser = null] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userAttr.email))

    if (!existingUser)
      throw response().error(404).message('User not found').exec()

    const { id, name, email, role } = existingUser
    const accessToken = await jwt.createAccessToken({
      id,
      name,
      email,
      role,
    })

    const refreshToken = await jwt.createRefreshToken({
      id,
    })

    // save refresh token to db
    await db.insert(tokensTable).values([
      {
        userId: id,
        token: refreshToken,
        expiresAt: new Date(validatedEnv.REF_TOKEN_EXP),
      },
    ])

    return {
      ...existingUser,
      token: {
        accessToken,
        refreshToken,
      },
    }
  }
}
