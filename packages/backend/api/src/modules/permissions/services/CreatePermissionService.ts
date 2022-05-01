import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import ICreatePermissionDTO from '../dtos/ICreatePermissionDTO'
import Permission from '../infra/typeorm/entities/Permission'
import IPermissionsRepository from '../repositories/IPermissionsRepository'

@injectable()
class CreatePermissionService {
  constructor(
    @inject('PermissionsRepository')
    private rolesRepository: IPermissionsRepository
  ) {}

  public async execute({
    name,
    description
  }: ICreatePermissionDTO): Promise<Permission> {
    const existPermission = await this.rolesRepository.findByName(name)

    if (existPermission) {
      throw new AppError('Permission already exists', 409, 'permission_exists')
    }

    return await this.rolesRepository.create({ name, description })
  }
}

export default CreatePermissionService
