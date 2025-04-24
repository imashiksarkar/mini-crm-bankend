import { Request, ErrorRequestHandler, NextFunction, Response } from 'express'

const errorHandler =
  () =>
  (
    err: ErrorRequestHandler,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (err instanceof Error) {
      res.status(500).send({
        success: false,
        error: {
          code: 500,
          message: [err.message],
        },
      })
      return
    }

    res.status(500).send({
      success: false,
      error: {
        code: 500,
        message: ['Something went wrong'],
      },
    })
  }

export default errorHandler
