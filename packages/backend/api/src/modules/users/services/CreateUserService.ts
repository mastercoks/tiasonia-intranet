import IRolesRepository from '@modules/roles/repositories/IRolesRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import ICreateUserDTO from '../dtos/ICreateUserDTO'
import User from '../infra/typeorm/entities/User'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'

interface IRequest {
  name: string
  login: string
  password: string
  roles: string[] | undefined
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    name,
    login,
    password,
    roles
  }: IRequest): Promise<User> {
    const existLogin = await this.usersRepository.findByLogin(login)

    if (existLogin) {
      throw new AppError('Login already exists', 409, 'login_exists')
    }
    const passwordHash = await this.hashProvider.generateHash(password)
    const data: ICreateUserDTO = {
      name,
      login,
      password: passwordHash
    }
    if (roles) {
      data.roles = await this.rolesRepository.findByIds(roles)
    }
    const user = await this.usersRepository.create(data)

    return user
  }
}

export default CreateUserService
