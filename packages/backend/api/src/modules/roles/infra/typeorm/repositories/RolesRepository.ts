import ICreateRoleDTO from '@modules/roles/dtos/ICreateRoleDTO'
import IListRoleDTO, { IResponse } from '@modules/roles/dtos/IListRoleDTO'
import IRolesRepository from '@modules/roles/repositories/IRolesRepository'
import { Equal, getRepository, Repository } from 'typeorm'

import Role from '../entities/Role'

class RolesRepository implements IRolesRepository {
  private ormRepository: Repository<Role>

  constructor() {
    this.ormRepository = getRepository(Role)
  }

  public async search({
    search,
    page,
    per_page
  }: IListRoleDTO): Promise<IResponse> {
    const response = await this.ormRepository
      .createQueryBuilder('roles')
      .where('roles.name like :name', {
        name: `%${search.name}%`
      })
      .andWhere('roles.description like :description', {
        description: `%${search.description}%`
      })
      .orderBy('roles.name', 'ASC')
      .skip(per_page * (page - 1))
      .take(per_page)
      .cache(true)
      .getManyAndCount()

    const roles = response[0]
    const totalCount = response[1]

    return { roles, totalCount }
  }

  public async findByIds(roles_ids: string[]): Promise<Role[]> {
    return await this.ormRepository.findByIds(roles_ids)
  }

  public async findById(id: string): Promise<Role> {
    return await this.ormRepository.findOne(id)
  }

  public async findByName(name: string): Promise<Role> {
    return await this.ormRepository.findOne({
      where: { name: Equal(name) }
    })
  }

  public async create(data: ICreateRoleDTO): Promise<Role> {
    const role = this.ormRepository.create(data)
    return await this.ormRepository.save(role)
  }

  public async save(role: Role): Promise<Role> {
    return await this.ormRepository.save(role)
  }
}

export default RolesRepository
