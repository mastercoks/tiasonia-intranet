import ICostCentersRepository from '@modules/costCenters/repositories/ICostCentersRepository'
import IRolesRepository from '@modules/roles/repositories/IRolesRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import ICreateUserDTO from '../dtos/ICreateUserDTO'
import User, { UserType } from '../infra/typeorm/entities/User'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  name: string
  cpf: string
  email: string | null
  password: string | null
  type: UserType
  company: string
  cost_center_name?: string
  cost_center_id?: string
  roles: string[] | undefined
}

@injectable()
class CreateUserService {
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
    name,
    cpf,
    email,
    password,
    type,
    company,
    cost_center_id,
    cost_center_name,
    roles
  }: IRequest): Promise<User> {
    const existCpf = await this.usersRepository.findByCpf(cpf)

    if (existCpf) {
      throw new AppError('Cpf already exists', 409, 'cpf_exists')
    }

    const cost_center = cost_center_name
      ? await this.costCentersRepository.findOrCreate({
          name: cost_center_name
        })
      : await this.costCentersRepository.findById(cost_center_id || '')

    if (!cost_center) {
      throw new AppError('Cost Center not found', 404, 'cost_center_not_found')
    }

    const data: ICreateUserDTO = {
      name,
      cpf,
      type,
      company,
      cost_center
    }
    if (email) {
      data.email = email
    }
    if (password) {
      const passwordHash = await this.hashProvider.generateHash(password)
      data.password = passwordHash
    }
    if (roles) {
      data.roles = await this.rolesRepository.findByIds(roles)
    }
    const user = await this.usersRepository.create(data)

    return user
  }
}

export default CreateUserService
