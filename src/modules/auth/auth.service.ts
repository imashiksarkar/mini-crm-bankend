import { db } from '@src/config'
import { jwt, response, validatedEnv } from '@src/lib'
import { eq } from 'drizzle-orm'
import { ChangeUserRoleDto, SigninUserDto, SignupUserDto } from './auth.dtos'
import { tokensTable, userRoleEnum, usersTable } from './db/schema'

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
        expiresAt: new Date(jwt.refreshTokenValidityMs),
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

    await db.insert(tokensTable).values([
      {
        userId: id,
        token: refreshToken,
        expiresAt: new Date(jwt.refreshTokenValidityMs),
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

  static readonly signout = async (userAttr: { refreshToken: string }) => {
    await db
      .delete(tokensTable)
      .where(eq(tokensTable.token, userAttr.refreshToken))
  }

  static readonly getRoles = async () => userRoleEnum.enumValues

  static readonly changeRole = async (userAttr: ChangeUserRoleDto) => {
    const [newUser] = await db
      .update(usersTable)
      .set({ role: userAttr.role })
      .where(eq(usersTable.email, userAttr.email))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
      })

    return newUser
  }

  static readonly refresh = async (refreshToken: string) => {
    const [deletedToken] = await db
      .delete(tokensTable)
      .where(eq(tokensTable.token, refreshToken))
      .returning()

    if (!deletedToken)
      throw response().error(401).message('Refresh token is missing.').exec()

    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
      })
      .from(usersTable)
      .where(eq(usersTable.id, deletedToken.userId))

    if (!user) throw response().error(401).message('User not found').exec()

    const { email, id, name, role } = user
    const accessToken = await jwt.createAccessToken({
      id,
      name,
      email,
      role,
    })

    const newRefreshToken = await jwt.createRefreshToken({
      id,
    })

    await db.insert(tokensTable).values([
      {
        userId: deletedToken.userId,
        token: newRefreshToken,
        expiresAt: new Date(jwt.refreshTokenValidityMs),
      },
    ])

    return {
      accessToken,
      refreshToken: newRefreshToken,
    }
  }
}
