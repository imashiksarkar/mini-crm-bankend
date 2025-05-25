import { DB } from '@src/config'
import { Hashing, jwt, response } from '@src/lib'
import { eq } from 'drizzle-orm'
import { ChangeUserRoleDto, SigninUserDto, SignupUserDto } from './auth.dtos'
import { tokensTable, userRoleEnum, usersTable } from './db/schema'

export default class AuthService {
  static readonly signup = async (userAttr: SignupUserDto) => {
    const [existingUser = null] = await DB.instance
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userAttr.email))

    if (existingUser)
      throw response().error(409).message('User already exists').exec()

    const hashedPassword = await Hashing.hash(userAttr.password)
    userAttr.password = hashedPassword

    const [user = null] = await DB.instance
      .insert(usersTable)
      .values([userAttr])
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
      })

    if (!user)
      throw response().error(500).message('Something went wrong').exec()

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
    await DB.instance.insert(tokensTable).values([
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
    const [existingUser = null] = await DB.instance
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userAttr.email))

    if (!existingUser)
      throw response().error(404).message('User not found').exec()

    const isValidPassword = await Hashing.verify(
      userAttr.password,
      existingUser.password
    )

    if (!isValidPassword)
      throw response().error(401).message('Invalid credentials').exec()

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

    await DB.instance.insert(tokensTable).values([
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
    await DB.instance
      .delete(tokensTable)
      .where(eq(tokensTable.token, userAttr.refreshToken))
  }

  static readonly getRoles = async () => userRoleEnum.enumValues

  static readonly changeRole = async (userAttr: ChangeUserRoleDto) => {
    const [newUser] = await DB.instance
      .update(usersTable)
      .set({ role: userAttr.role })
      .where(eq(usersTable.email, userAttr.email))
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
      })

    if (!newUser) throw response().error(404).message('User not found').exec()

    return newUser
  }

  static readonly refresh = async (refreshToken: string) => {
    const [deletedToken] = await DB.instance
      .delete(tokensTable)
      .where(eq(tokensTable.token, refreshToken))
      .returning()

    if (!deletedToken)
      throw response().error(401).message('Refresh token is missing.').exec()

    const [user] = await DB.instance
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

    await DB.instance.insert(tokensTable).values([
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

  static readonly getAllUsers = async () => {
    const { id, name, email, role, createdAt, updatedAt } = usersTable

    const users = await DB.instance
      .select({
        id,
        name,
        email,
        role,
        createdAt,
        updatedAt,
      })
      .from(usersTable)

    return users
  }

  static readonly getUserById = async (userId: string) => {
    const { id, name, email, role, createdAt, updatedAt } = usersTable

    const [user = null] = await DB.instance
      .select({
        id,
        name,
        email,
        role,
        createdAt,
        updatedAt,
      })
      .from(usersTable)
      .where(eq(usersTable.id, userId))

    return user
  }
}
