import { Router, Request, Response } from 'express'
import ClientService from './client.service'
import { catchAsync, response } from '@src/lib'
import { createClientDto } from './client.dtos'
import { requireAuth } from '@src/middlewares'
import { ReqWithUser } from '@src/middlewares/requireAuth.middleware'

class ClientController {
  private static readonly router = Router()
  private static readonly clientService: typeof ClientService = ClientService
  private static readonly getPath = (path: string) => `/clients${path}`

  /* Prepare the module */
  static get clientModule() {
    try {
      const EOFIndex = Object.keys(this).indexOf('EOF') + 1 || 0
      const methods = Object.keys(this).splice(EOFIndex) // skip constructor

      methods.forEach((name) => eval(`this.${name}()`))

      return this.router
    } catch (error) {
      console.log(`Client module error: ${error}`)
    }
  }

  private static readonly EOF = null // routes begin after line

  /* Hare are all the routes */
  private static readonly create = async (path = this.getPath('/')) => {
    this.router.post(
      path,
      requireAuth(),
      catchAsync(async (req: ReqWithUser, res: Response) => {
        const { id } = req.locals.user
        const body = createClientDto.parse(req.body)

        const client = await this.clientService.createClient(id, body)

        const r = response()
          .success(201)
          .data(client)
          .exec()
        res.status(r.code).json(r)
      })
    )
  }
}

export default ClientController.clientModule as Router
