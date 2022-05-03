import { Equal, getRepository, Repository } from 'typeorm'

import ICreateUserDTO from '../../../dtos/ICreateUserDTO'
import ISearchUserDTO, { IResponse } from '../../../dtos/ISearchUserDTO'
import IUsersRepository from '../../../repositories/IUsersRepository'
import User from '../entities/User'

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>

  constructor() {
    this.ormRepository = getRepository(User)
  }

  public async search({
    search,
    page,
    per_page = 10
  }: ISearchUserDTO): Promise<IResponse> {
    const response = await this.ormRepository
      .createQueryBuilder('users')
      .where('users.name like :name', { name: `%${search.name}%` })
      .andWhere('users.login like :login', { login: `%${search.login}%` })
      .orderBy('users.name', 'ASC')
      .skip(per_page * (page - 1))
      .take(per_page)
      .cache(true)
      .getManyAndCount()

    const users = response[0]
    const totalCount = response[1]

    return { users, totalCount }
  }

  public async findById(id: string): Promise<User | undefined> {
    return await this.ormRepository.findOne(id, {
      relations: ['roles']
    })
  }

  public async findByLogin(login: string): Promise<User | undefined> {
    return await this.ormRepository.findOne({
      where: { login: Equal(login) },
      relations: ['roles']
    })
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(data)
    return await this.ormRepository.save(user)
  }

  public async save(user: User): Promise<User> {
    return await this.ormRepository.save(user)
  }
}

export default UsersRepository
