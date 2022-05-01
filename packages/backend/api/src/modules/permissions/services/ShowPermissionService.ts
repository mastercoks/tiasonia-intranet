import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import Permission from '../infra/typeorm/entities/Permission'
import IPermissionsRepository from '../repositories/IPermissionsRepository'

@injectable()
class ShowPermissionService {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository
  ) {}

  public async execute(id: string): Promise<Permission> {
    const permission = await this.permissionsRepository.findById(id)

    if (!permission || !id) {
      throw new AppError('Permission not found', 404, 'permission_not_found')
    }

    return permission
  }
}

export default ShowPermissionService
