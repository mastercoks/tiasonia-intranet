import IRolesRepository from '@modules/roles/repositories/IRolesRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import User from '../infra/typeorm/entities/User'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  id: string
  name: string | undefined
  password: string | undefined
  active: boolean | undefined
  roles: string[] | undefined
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    id,
    name,
    password,
    active,
    roles
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(id)

    if (!user || !id) {
      throw new AppError('User not found', 404, 'user_not_found')
    }

    if (name) {
      user.name = name
    }

    if (password) {
      const passwordMatched = await this.hashProvider.compareHash(
        password,
        user.password
      )

      if (!passwordMatched) {
        const passwordHash = await this.hashProvider.generateHash(password)
        user.password = passwordHash
      }
    }

    if (active !== undefined) {
      user.active = active
    }

    if (roles) {
      user.roles = await this.rolesRepository.findByIds(roles)
    }

    return this.usersRepository.save(user)
  }
}

export default UpdateUserService
