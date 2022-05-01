import { inject, injectable } from 'tsyringe'

import User from '../infra/typeorm/entities/User'
import IUsersRepository from '../repositories/IUsersRepository'

interface Request {
  company: string
}

@injectable()
class SearchCompanyService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ company }: Request): Promise<User[]> {
    return await this.usersRepository.findCompanies(company)
  }
}

export default SearchCompanyService
