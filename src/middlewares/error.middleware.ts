import response, { Res } from '@src/lib/response'
import { DrizzleError } from 'drizzle-orm'
import { Request, ErrorRequestHandler, NextFunction, Response } from 'express'

const errorHandler =
  () =>
  (
    err: ErrorRequestHandler,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (err instanceof Res) {
      res.status(err.code).json(err)
      return
    } else if (err instanceof DrizzleError) {
      const e = response().error(500).message(err.message).exec()
      res.status(e.code).json(e)
      return
    } else if (err instanceof Error) {
      const e = response().error(500).message(err.message).exec()
      res.status(e.code).json(e)
      return
    }

    const e = response().error(500).message('Something went wrong').exec()
    res.status(e.code).json(e)
  }

export default errorHandler
