import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import Permission from '../infra/typeorm/entities/Permission'
import IPermissionsRepository from '../repositories/IPermissionsRepository'

interface Request {
  id: string
  name: string
  description: string
}

@injectable()
class UpdatePermissionService {
  constructor(
    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository
  ) {}

  public async execute({
    id,
    name,
    description
  }: Request): Promise<Permission> {
    const permission = await this.permissionsRepository.findById(id)

    if (!permission || !id) {
      throw new AppError('Permission not found', 404, 'permission_not_found')
    }

    if (name && name !== permission.name) {
      const existName = await this.permissionsRepository.findByName(name)

      if (existName) {
        permission.name = name
      }
    }

    if (description) {
      permission.description = description
    }

    return await this.permissionsRepository.save(permission)
  }
}

export default UpdatePermissionService
