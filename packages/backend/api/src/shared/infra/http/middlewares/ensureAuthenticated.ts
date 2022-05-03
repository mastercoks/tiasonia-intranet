/* eslint-disable @typescript-eslint/no-explicit-any */
import authConfig from '@config/auth'
import User from '@modules/users/infra/typeorm/entities/User'
import ShowUserService from '@modules/users/services/ShowUserService'
import AppError from '@shared/errors/AppError'
import { Request, Response, NextFunction } from 'express'
import { verify, decode, TokenExpiredError } from 'jsonwebtoken'
import { container } from 'tsyringe'

async function decoder(authHeader: string): Promise<User | string | undefined> {
  const showUser = container.resolve(ShowUserService)

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401, 'token_missing')
  }

  const [, token] = authHeader.split(' ')

  try {
    verify(token, authConfig.secret)
    const payload: any = decode(token)

    if (payload?.id) return payload?.id

    const user = await showUser.execute(payload?.sub)

    if (!user.active) {
      throw new AppError('User inactive', 401, 'user_inactive')
    }

    return user
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new AppError('Expired JWT token', 401, 'token_expired')
    } else if (!(err instanceof AppError)) {
      throw new AppError('Invalid JWT token', 401, 'token_invalid')
    }
  }
}

function is(permission: string): any {
  const roleAuthorized = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const user = await decoder(req.headers.authorization)
    if (typeof user === 'string')
      throw new AppError('Invalid JWT token', 401, 'token_unauthorized')
    if (user) req.headers.user_id = user.id

    const permissions = [
      ...new Set(
        user?.roles?.flatMap(role =>
          role?.permissions?.map(permission => permission.name)
        )
      )
    ]

    const existsRoles = permissions?.some(p => p === permission)

    if (existsRoles) {
      return next()
    }
    throw new AppError('User not authorized', 401, 'token_unauthorized')
  }

  return roleAuthorized
}

function verifyRecipient(): any {
  const roleAuthorized = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const recipientId = await decoder(req.headers.authorization)

    if (typeof recipientId !== 'string')
      throw new AppError('Invalid JWT token', 401, 'token_unauthorized')

    if (recipientId) return next()

    throw new AppError('User not authorized', 401, 'token_unauthorized')
  }

  return roleAuthorized
}

export { is, verifyRecipient }
