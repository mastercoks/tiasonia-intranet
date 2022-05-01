import ICreateRoleDTO from '../dtos/ICreateRoleDTO'
import IListRoleDTO, { IResponse } from '../dtos/IListRoleDTO'
import Role from '../infra/typeorm/entities/Role'

interface IRolesRepository {
  search(data: IListRoleDTO): Promise<IResponse>
  findByIds(roles_ids: string[]): Promise<Role[]>
  findById(id: string): Promise<Role>
  findByName(name: string): Promise<Role>
  create(data: ICreateRoleDTO): Promise<Role>
  save(user: Role): Promise<Role>
}

export default IRolesRepository
