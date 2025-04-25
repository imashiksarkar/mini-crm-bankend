import '@lib/validatedEnv'
import { errorHandler, notFoundHandler } from '@middlewares/index'
import authModule from '@modules/auth'
import { getRelativeTime, response } from '@src/lib'
import express, { Request, Response } from 'express'
import cookieParser from 'cookie-parser'

const startTime = Date.now()

const app = express()

app.use(express.json())
app.use(cookieParser())

app.get('/', (_req: Request, res: Response) => {
  const r = response().success(200).message('App is running fine 🚀').exec()
  res.status(r.code).json(r)
})

app.get('/health', (_req: Request, res: Response) => {
  const r = response()
    .success(200)
    .message('App is running fine 🚀')
    .data({
      uptime: getRelativeTime(startTime),
    })
    .exec()
  res.status(r.code).json(r)
})

app.use(authModule)

app.use(notFoundHandler())
app.use(errorHandler())

export default app
