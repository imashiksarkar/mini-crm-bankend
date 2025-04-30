import response, { Res } from '@src/lib/response'
import { DrizzleError } from 'drizzle-orm'
import { Request, ErrorRequestHandler, NextFunction, Response } from 'express'
import {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from 'jsonwebtoken'
import { ZodError, ZodFormattedError } from 'zod'

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
    else if (err instanceof DrizzleError)
      e = response().error(500).message(err.message).exec()
    else if (
      err instanceof TokenExpiredError ||
      err instanceof NotBeforeError ||
      err instanceof JsonWebTokenError
    )
      e = response().error(401).message(err.message).exec()
    else if (err instanceof ZodError) {
      console.log()
      const fieldError = Object.values(err.flatten().fieldErrors)
        .flat()
        .join('\n')
      e = response().error(400).message(fieldError).exec()
    } else if (err instanceof Error)
      e = response().error(500).message(err.message).exec()

    const code = /duplicate/gi.test(e.error!.message.join('\n')) ? 409 : null

    e = response()
      .error(code || e.code)
      .message(e.error!.message)
      .exec()

    res.status(e.code).json(e)
  }

export default errorHandler
