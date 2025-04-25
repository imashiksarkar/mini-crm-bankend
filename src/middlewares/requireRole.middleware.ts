import { catchAsync, response } from '@src/lib'
import { IUser, ReqWithUser } from '@src/middlewares/requireAuth.middleware'
import { NextFunction, Response } from 'express'

const requireRole = (role: IUser['role']) =>
  catchAsync(
    async (
      req: ReqWithUser<'passThrough'>,
      _res: Response,
      next: NextFunction
    ) => {
      if (
        !req.locals.user ||
        !req.locals.user.role.some((r) => role.includes(r))
      ) {
        throw response().error(403).message('Not allowed').exec()
      }

      return next()
    }
  )

export default requireRole
