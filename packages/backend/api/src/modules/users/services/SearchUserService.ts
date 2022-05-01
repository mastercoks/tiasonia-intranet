import { inject, injectable } from 'tsyringe'

import ISearchUserDTO, { IResponse } from '../dtos/ISearchUserDTO'
import IUsersRepository from '../repositories/IUsersRepository'

@injectable()
class SearchUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({
    search,
    page,
    per_page = 10
  }: ISearchUserDTO): Promise<IResponse> {
    return await this.usersRepository.search({
      search,
      page,
      per_page
    })
  }
}

export default SearchUserService
