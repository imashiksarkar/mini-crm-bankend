import { Request, Response, Router } from 'express'

const appModule = Router()

appModule.get('/auth', (_req: Request, res: Response) => {
  res.send('Hello World!')
})

export default appModule
