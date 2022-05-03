import { inject, injectable } from 'tsyringe'

import User from '../infra/typeorm/entities/User'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'

export interface IRequest {
  name: string
  login: string
  password: string
}

@injectable()
class CreateOrUpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({ name, login, password }: IRequest): Promise<User> {
    let user = await this.usersRepository.findByLogin(login)

    if (!user) {
      const passwordHash = await this.hashProvider.generateHash(password)

      user = await this.usersRepository.create({
        name,
        login,
        password: passwordHash
      })
    } else {
      user.name = name
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
    }

    return this.usersRepository.save(user)
  }
}

export default CreateOrUpdateUserService
