import jwt from 'jsonwebtoken'
import validatedEnv from './validatedEnv'

export default class JWT {
  static get accessTokenValidityMs() {
    return Date.now() + validatedEnv.ACC_TOKEN_EXP
  }
  static get refreshTokenValidityMs() {
    return Date.now() + validatedEnv.REF_TOKEN_EXP
  }

  static createAccessToken = async (user: {
    id: string
    email: string
    role: string[]
    name: string
  }) => {
    const payload = {
      email: user.email,
      role: user.role,
      name: user.name,
    }

    const accessToken = await jwt.sign(payload, validatedEnv.JWT_SECRET, {
      expiresIn: this.accessTokenValidityMs,
      subject: user.id,
    })

    return accessToken
  }

  static createRefreshToken = async (user: { id: string }) => {
    const payload = {}

    const accessToken = await jwt.sign(payload, validatedEnv.JWT_SECRET, {
      expiresIn: this.refreshTokenValidityMs,
      subject: user.id,
    })

    return accessToken
  }

  static decodeToken = async (token: string) => {
    const decoded = await jwt.verify(token, validatedEnv.JWT_SECRET)
    return decoded as {
      email: string
      exp: number
      iat: number
      name: string
      role: string[]
      sub: string
    }
  }
}
