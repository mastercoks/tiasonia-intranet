import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'

@injectable()
class ShowUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id)

    if (!user || !id) {
      throw new AppError('User not found', 404, 'user_not_found')
    }

    return user
  }
}

export default ShowUserService
