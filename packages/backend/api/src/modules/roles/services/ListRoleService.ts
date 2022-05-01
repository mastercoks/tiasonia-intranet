import { inject, injectable } from 'tsyringe'

import IListRoleDTO, { IResponse } from '../dtos/IListRoleDTO'
import IRolesRepository from '../repositories/IRolesRepository'

@injectable()
class ListRoleService {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository
  ) {}

  public async execute(data: IListRoleDTO): Promise<IResponse> {
    return await this.rolesRepository.search(data)
  }
}

export default ListRoleService
