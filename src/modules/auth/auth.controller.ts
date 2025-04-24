import { Request, Response, Router } from 'express'
import AuthService from './auth.service'

class AuthController {
  private static readonly router = Router()
  private static readonly authService: typeof AuthService = AuthService

  static get authModule() {
    try {
      const methods = Object.keys(this).splice(2) // skip constructor

      methods.forEach((name) => eval(`this.${name}()`))

      return this.router
    } catch (error) {
      console.log(`Auth module error: ${error}`)
    }
  }

  /* Hare are all the routes */
  private static readonly signup = async (path = '/auth/signup') => {
    this.authService.log()

    this.router.get(path, async (_req: Request, res: Response) => {
      res.send({
        success: true,
        code: 200,
        // data,
      })
    })
  }

  private static readonly signin = async (path = '/auth/signin') => {
    this.router.get(path, (_req: Request, res: Response) => {
      res.send('Hello World!')
    })
  }

  private static readonly signout = async (path = '/auth/signout') => {
    this.router.get(path, (_req: Request, res: Response) => {
      res.send('Hello World!')
    })
  }
}

export default AuthController.authModule
