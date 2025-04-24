import { Request, Response, Router } from 'express'

const appModule = Router()

appModule.get('/auth/signup', async (_req: Request, res: Response) => {
  res.send({
    success: true,
    code: 200,
    // data,
  })
})

appModule.get('/auth/signin', (_req: Request, res: Response) => {
  res.send('Hello World!')
})

appModule.get('/auth/signout', (_req: Request, res: Response) => {
  res.send('Hello World!')
})

export default appModule
