import ICostCentersRepository from '@modules/costCenters/repositories/ICostCentersRepository'
import IRolesRepository from '@modules/roles/repositories/IRolesRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import User, { UserType } from '../infra/typeorm/entities/User'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  id: string
  name: string | undefined
  email: string | undefined
  type: UserType | undefined
  password: string | undefined
  active: boolean | undefined
  company: string | undefined
  cost_center: string | undefined
  roles: string[] | undefined
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CostCentersRepository')
    private costCentersRepository: ICostCentersRepository,
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    id,
    name,
    email,
    type,
    password,
    active,
    company,
    cost_center,
    roles
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(id)

    if (!user || !id) {
      throw new AppError('User not found', 404, 'user_not_found')
    }

    if (name) {
      user.name = name
    }

    if (email) {
      user.email = email
    }

    if (type) {
      user.type = type
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

    if (company) {
      user.company = company
    }

    if (cost_center) {
      user.cost_center = await this.costCentersRepository.findById(cost_center)
      if (!user.cost_center) {
        throw new AppError(
          'Cost Center not found',
          404,
          'cost_center_not_found'
        )
      }
    }

    if (roles) {
      user.roles = await this.rolesRepository.findByIds(roles)
    }

    return this.usersRepository.save(user)
  }
}

export default UpdateUserService
