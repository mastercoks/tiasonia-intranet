import ICreatePermissionDTO from '@modules/permissions/dtos/ICreatePermissionDTO'
import IListPermissionDTO, {
  IResponse
} from '@modules/permissions/dtos/IListPermissionDTO'
import IPermissionsRepository from '@modules/permissions/repositories/IPermissionsRepository'
import { getRepository, Repository } from 'typeorm'

import Permission from '../entities/Permission'

class PermissionsRepository implements IPermissionsRepository {
  private ormRepository: Repository<Permission>

  constructor() {
    this.ormRepository = getRepository(Permission)
  }

  public async search({
    search,
    page,
    per_page
  }: IListPermissionDTO): Promise<IResponse> {
    const response = await this.ormRepository
      .createQueryBuilder('permissions')
      .where('permissions.name like :name', {
        name: `%${search.name}%`
      })
      .andWhere('permissions.description like :description', {
        description: `%${search.description}%`
      })
      .orderBy('permissions.name', 'ASC')
      .skip(per_page * (page - 1))
      .take(per_page)
      .cache(true)
      .getManyAndCount()

    const permissions = response[0]
    const totalCount = response[1]

    return { permissions, totalCount }
  }

  public async findByIds(permissions_ids: string[]): Promise<Permission[]> {
    return await this.ormRepository.findByIds(permissions_ids)
  }

  public async findById(id: string): Promise<Permission> {
    return await this.ormRepository.findOne(id)
  }

  public async findByName(name: string): Promise<Permission> {
    return await this.ormRepository.findOne(name)
  }

  public async create(data: ICreatePermissionDTO): Promise<Permission> {
    const permission = this.ormRepository.create(data)
    return await this.ormRepository.save(permission)
  }

  public async save(permission: Permission): Promise<Permission> {
    return await this.ormRepository.save(permission)
  }
}

export default PermissionsRepository
