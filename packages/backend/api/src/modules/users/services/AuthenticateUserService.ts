import authConfig from '@config/auth'
import AppError from '@shared/errors/AppError'
import { classToClass } from 'class-transformer'
import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  login: string
  password: string
}

interface IResponse {
  token: string
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ login, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByLogin(login)

    if (!user) {
      throw new AppError(
        'Incorrect login/password combination.',
        401,
        'incorrect_combination'
      )
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password
    )

    if (!passwordMatched) {
      throw new AppError(
        'Incorrect login/password combination.',
        401,
        'incorrect_combination'
      )
    }

    if (!user?.active) {
      throw new AppError('User inactive', 401, 'user_inactive')
    }

    const { secret, expiresIn } = authConfig

    const permissions = [
      ...new Set(
        user?.roles?.flatMap(role =>
          role?.permissions?.map(permission => permission.name)
        )
      )
    ]

    delete user.roles

    const token = sign({ user: classToClass(user), permissions }, secret, {
      subject: user.id,
      expiresIn
    })

    return { token }
  }
}

export default AuthenticateUserService
