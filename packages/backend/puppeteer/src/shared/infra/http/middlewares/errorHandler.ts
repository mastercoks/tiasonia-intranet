import AppError from '@shared/errors/AppError'
import CNPJInvalidError from '@shared/errors/CNPJInvalidError'
import { NODE_ENV } from '@shared/utils/environment'
import { CelebrateError } from 'celebrate'
import { Request, Response, NextFunction } from 'express'

export default function errorHandler(
  err: CelebrateError | CNPJInvalidError | AppError | Error,
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

  if (err instanceof CelebrateError) {
    let errors = ''
    for (const [, joiError] of err.details.entries()) {
      joiError.details.forEach(({ message }) => {
        errors += message
      })
    }
    return res.status(412).json({
      error: err.message,
      message: errors
    })
  }

  if (err instanceof CNPJInvalidError)
    return res.status(err.statusCode).json({
      error: err.code,
      message: err.message
    })

  if (err instanceof AppError)
    return res.status(err.statusCode).json({
      code: err.code,
      message: message
    })

  return res.status(500).json({ error: 'Internal server error' })
}
