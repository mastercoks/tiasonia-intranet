import { inject, injectable } from 'tsyringe'

import IListPermissionDTO, { IResponse } from '../dtos/IListPermissionDTO'
import IPermissionsRepository from '../repositories/IPermissionsRepository'

@injectable()
class ListPermissionService {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository
  ) {}

  public async execute(data: IListPermissionDTO): Promise<IResponse> {
    return await this.permissionsRepository.search(data)
  }
}

export default ListPermissionService
