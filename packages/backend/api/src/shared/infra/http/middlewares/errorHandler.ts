import AppError from '@shared/errors/AppError'
import { NODE_ENV } from '@shared/utils/environment'
import { Request, Response, NextFunction } from 'express'

export default function errorHandler(
  err: AppError | Error,
  req: Request,
  res: Response,
  _: NextFunction
): Response<any> {
  const { message } = err

  if (NODE_ENV !== 'production') {
    console.error({
      action: '@shared/infra/http/middlewares/errorHandling.ts',
      message
    })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: message
    })
  }

  return res.status(500).json({ error: 'Internal server error' })
}
