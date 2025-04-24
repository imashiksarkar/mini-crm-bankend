import { errorHandler, notFoundHandler } from '@middlewares/index'
import appModule from '@modules/auth'
import express, { Request, Response } from 'express'

import { config } from 'dotenv'

const app = express()

config({
  path: './.env.local',
})

app.use(express.json())

app.get('/', (_req: Request, res: Response) => {
  res.send({
    success: true,
    code: 200,
    data: {
      message: 'App is running fine. 🚀',
    },
  })
})

app.use(appModule)

app.use(notFoundHandler())
app.use(errorHandler())

export default app
