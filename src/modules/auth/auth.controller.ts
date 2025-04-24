import { Request, Response, Router } from 'express'
import { signupUserDto } from './auth.dtos'
import AuthService from './auth.service'
import { catchAsync } from '@src/lib'

class AuthController {
  private static readonly router = Router()
  private static readonly authService: typeof AuthService = AuthService
  private static readonly getPath = (path: string) => `/auth${path}`

  /* Prepare the module */
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
    this.router.post(
      path,
      catchAsync(async (req: Request, res: Response) => {
        try {
          const body = await signupUserDto.parseAsync(req.body)

          const { password, email, ...signedUpUser } =
            await this.authService.signup(body)

          res.status(201).json({
            success: true,
            code: 201,
            data: signedUpUser,
          })
        } catch (error) {
          res.status(400).json({
            success: false,
            code: 400,
            error: {
              code: 400,
              message: [error],
            },
          })
        }
      })
    )
  }

  private static readonly signin = async (path = this.getPath('/signin')) => {
    this.router.get(
      path,
      catchAsync(async (_req: Request, res: Response) => {
        res.send('Hello World!')
      })
    )
  }

  private static readonly signout = async (path = this.getPath('/signout')) => {
    this.router.get(
      path,
      catchAsync(async (_req: Request, res: Response) => {
        res.send('Hello World!')
      })
    )
  }
}

export default AuthController.authModule as Router
