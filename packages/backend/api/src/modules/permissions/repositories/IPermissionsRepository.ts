import ICreatePermissionDTO from '../dtos/ICreatePermissionDTO'
import IListPermissionDTO, { IResponse } from '../dtos/IListPermissionDTO'
import Permission from '../infra/typeorm/entities/Permission'

interface IPermissionsRepository {
  search(data: IListPermissionDTO): Promise<IResponse>
  findByIds(permissions_ids: string[]): Promise<Permission[]>
  findById(id: string): Promise<Permission>
  findByName(name: string): Promise<Permission>
  create(data: ICreatePermissionDTO): Promise<Permission>
  save(user: Permission): Promise<Permission>
}

export default IPermissionsRepository
