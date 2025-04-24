import { NextFunction, Request, Response } from 'express'

const catchAsync =
  (cb: Function) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cb(req as Request, res, next)
    } catch (error) {
      next(error)
    }
  }

export default catchAsync
