import { Router } from 'express'
import ClientService from './client.service'

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
  // private static readonly getRoles = async (path = this.getPath('/roles')) => {
  //   this.router.get(
  //     path,
  //     catchAsync(async (_req: Request, res: Response) => {

  //       const r = response()
  //         .success(200)
  //         // .data(roles)
  //         .message('Here are all the roles.')
  //         .exec()
  //       res.status(r.code).json(r)
  //     })
  //   )
  // }
}

export default ClientController.clientModule as Router
