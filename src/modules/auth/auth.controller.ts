import { Request, Response, Router } from 'express'
import AuthService from './auth.service'

class AuthController {
  private static readonly router = Router()
  private static readonly authService: typeof AuthService = AuthService
  private static readonly getPath = (path: string) => `/auth${path}`

  static get authModule() {
    try {
      const EOFIndex = Object.keys(this).indexOf('EOF') + 1 || 0
      const methods = Object.keys(this).splice(EOFIndex) // skip constructor

      methods.forEach((name) => eval(`this.${name}()`))

      return this.router
    } catch (error) {
      console.log(`Auth module error: ${error}`)
    }
  }

  private static readonly EOF = null // routes begin after line

  /* Hare are all the routes */
  private static readonly signup = async (path = this.getPath('/signup')) => {
    this.authService.log()

    this.router.get(path, async (_req: Request, res: Response) => {
      res.send({
        success: true,
        code: 200,
        // data,
      })
    })
  }

  private static readonly signin = async (path = this.getPath('/signin')) => {
    this.router.get(path, (_req: Request, res: Response) => {
      res.send('Hello World!')
    })
  }

  private static readonly signout = async (path = this.getPath('/signout')) => {
    this.router.get(path, (_req: Request, res: Response) => {
      res.send('Hello World!')
    })
  }
}

export default AuthController.authModule
