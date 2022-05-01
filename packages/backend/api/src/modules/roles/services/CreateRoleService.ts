import IPermissionsRepository from '@modules/permissions/repositories/IPermissionsRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import Role from '../infra/typeorm/entities/Role'
import IRolesRepository from '../repositories/IRolesRepository'

interface Request {
  name: string
  description: string
  permissions_ids: string[]
}

@injectable()
class CreateRoleService {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository,
    @inject('PermissionsRepository')
    private permissionsRepository: IPermissionsRepository
  ) {}

  public async execute({
    name,
    description,
    permissions_ids
  }: Request): Promise<Role> {
    const existRole = await this.rolesRepository.findByName(name)

    if (existRole) {
      throw new AppError('Role already exists', 409, 'role_exists')
    }

    const permissions = await this.permissionsRepository.findByIds(
      permissions_ids
    )

    return await this.rolesRepository.create({ name, description, permissions })
  }
}

export default CreateRoleService
