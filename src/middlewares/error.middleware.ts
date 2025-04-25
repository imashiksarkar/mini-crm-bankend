import response, { Res } from '@src/lib/response'
import { DrizzleError } from 'drizzle-orm'
import { Request, ErrorRequestHandler, NextFunction, Response } from 'express'
import {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from 'jsonwebtoken'

const errorHandler =
  () =>
  (
    err: ErrorRequestHandler,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    let e = response().error(500).message('Something went wrong').exec()

    if (err instanceof Res) e = err
    else if (err instanceof DrizzleError || err instanceof Error)
      e = response().error(500).message(err.message).exec()
    else if (
      err instanceof TokenExpiredError ||
      err instanceof NotBeforeError ||
      err instanceof JsonWebTokenError
    ) {
      e = response().error(401).message(err.message).exec()
    }

    res.status(e.code).json(e)
  }

export default errorHandler
