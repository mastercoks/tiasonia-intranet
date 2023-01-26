import CreatePermissionService from '@modules/permissions/services/CreatePermissionService'
import CreateRoleService from '@modules/roles/services/CreateRoleService'
import CreateUserService from '@modules/users/services/CreateUserService'
import { classToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

const permissions = [
  {
    name: 'CONFLICT',
    description: 'Habilita o menu Conflitos de Cadastro'
  },
  {
    name: 'SETTINGS',
    description: 'Habilita o menu Configurações'
  },
  {
    name: 'SYNC_CONFLICT',
    description: 'Sincroniza os conflitos'
  },
  {
    name: 'STOP_SYNC_CONFLICT',
    description: 'Interrompe a sincronização dos conflitos'
  },
  {
    name: 'LIST_EXECUTIONS',
    description: 'Lista as execuções de conflitos'
  },
  {
    name: 'LIST_CONFLICT',
    description: 'Lista os conflitos'
  },
  {
    name: 'LIST_PERMISSION',
    description: 'Lista as permissões'
  },
  {
    name: 'CREATE_PERMISSION',
    description: 'Cria uma permissão'
  },
  {
    name: 'SHOW_PERMISSION',
    description: 'Visualiza uma permissão'
  },
  {
    name: 'UPDATE_PERMISSION',
    description: 'Atualiza uma permissão'
  },
  {
    name: 'LIST_ROLE',
    description: 'Lista os grupos'
  },
  {
    name: 'CREATE_ROLE',
    description: 'Cria um grupo'
  },
  {
    name: 'SHOW_ROLE',
    description: 'Visualiza um grupo'
  },
  {
    name: 'UPDATE_ROLE',
    description: 'Atualiza um grupo'
  },
  {
    name: 'LIST_USER',
    description: 'Lista os usuários'
  },
  {
    name: 'CREATE_USER',
    description: 'Cria um usuário'
  },
  {
    name: 'SHOW_USER',
    description: 'Visualiza um usuário'
  },
  {
    name: 'UPDATE_USER',
    description: 'Atualiza um usuário'
  }
]

class InitController {
  public async create(req: Request, res: Response): Promise<Response> {
    const createPermission = container.resolve(CreatePermissionService)

    const permissionsIds = []

    for (const { name, description } of permissions) {
      const { id } = await createPermission.execute({
        name,
        description
      })
      permissionsIds.push(id)
    }

    const createRole = container.resolve(CreateRoleService)

    const { id } = await createRole.execute({
      name: 'ADMIN',
      description: 'Grupo Admininstrador',
      permissions_ids: permissionsIds
    })

    const createUserService = container.resolve(CreateUserService)

    const user = await createUserService.execute({
      name: 'Admininstrador',
      login: 'admin',
      password: 'admin',
      roles: [id]
    })

    return res.json(classToClass(user))
  }
}

export default InitController
