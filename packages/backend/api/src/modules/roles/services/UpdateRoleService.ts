import IPermissionsRepository from '@modules/permissions/repositories/IPermissionsRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import Role from '../infra/typeorm/entities/Role'
import IRolesRepository from '../repositories/IRolesRepository'

interface Request {
  id: string
  name: string
  description: string
  permissions_ids: string[]
}

@injectable()
class UpdateRoleService {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository
  ) {}

  public async execute({
    id,
    name,
    description,
    permissions_ids
  }: Request): Promise<Role> {
    const role = await this.rolesRepository.findById(id)

    if (!role || !id) {
      throw new AppError('Role not found', 404, 'role_not_found')
    }

    if (name && name !== role.name) {
      const existName = await this.rolesRepository.findByName(name)

      if (existName) {
        role.name = name
      }
    }

    if (description) {
      role.description = description
    }

    if (permissions_ids) {
      role.permissions = await this.permissionsRepository.findByIds(
        permissions_ids
      )
    }

    return await this.rolesRepository.save(role)
  }
}

export default UpdateRoleService
