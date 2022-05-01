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
      .innerJoinAndSelect('users.cost_center', 'cost_center')
      .where('users.name like :name', { name: `%${search.name}%` })
      .andWhere('users.cpf like :cpf', { cpf: `%${search.cpf}%` })
      .andWhere('users.type like :type', { type: `%${search.type}%` })
      .andWhere('users.company like :company', {
        company: `%${search.company}%`
      })
      .andWhere('users.cost_center like :cost_center', {
        cost_center: search.cost_center || '%%'
      })
      .andWhere(qb => {
        const subQuery = qb
          .subQuery()
          .select()
          .from('cards', 'cards')
          .where(`users.id = cards.user_id`)
          .andWhere(`cards.number = :number_card`, {
            number_card: `${search.number_card}`
          })
          .andWhere('cards.active = :active', {
            active: true
          })
          .getQuery()
        return (search.number_card ? 'EXISTS ' : 'NOT EXISTS') + subQuery
      })
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
      relations: ['cost_center', 'roles', 'contact']
    })
  }

  public async getCardsById(id: string): Promise<User | undefined> {
    return await this.ormRepository.findOne(id, {
      relations: ['cards']
    })
  }

  public async findByCpf(cpf: string): Promise<User | undefined> {
    return await this.ormRepository.findOne({
      where: { cpf: Equal(cpf) },
      relations: ['roles', 'contact']
    })
  }

  public async findCards(id: string): Promise<User | undefined> {
    return await this.ormRepository.findOne(id, {
      relations: ['cards', 'cards.user']
    })
  }

  public async findCompanies(company: string): Promise<User[]> {
    return await this.ormRepository
      .createQueryBuilder('users')
      .select('DISTINCT(`users`.`company`)')
      .where('users.company like :company', { company: `%${company}%` })
      .orderBy('users.company', 'ASC')
      .getRawMany()
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
