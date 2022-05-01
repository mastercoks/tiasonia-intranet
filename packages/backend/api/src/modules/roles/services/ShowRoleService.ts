import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import Role from '../infra/typeorm/entities/Role'
import IRolesRepository from '../repositories/IRolesRepository'

@injectable()
class ShowRoleService {
  constructor(
    @inject('RolesRepository')
    private rolesRepository: IRolesRepository
  ) {}

  public async execute(id: string): Promise<Role> {
    const role = await this.rolesRepository.findById(id)

    if (!role || !id) {
      throw new AppError('Role not found', 404, 'role_not_found')
    }

    return role
  }
}

export default ShowRoleService
