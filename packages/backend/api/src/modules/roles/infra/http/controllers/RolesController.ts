import CreateRoleService from '@modules/roles/services/CreateRoleService'
import ListRoleService from '@modules/roles/services/ListRoleService'
import ShowRoleService from '@modules/roles/services/ShowRoleService'
import UpdateRoleService from '@modules/roles/services/UpdateRoleService'
import { classToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class RolesController {
  public async list(req: Request, res: Response): Promise<Response> {
    const { page = 1, per_page = 10, name = '', description = '' } = req.query

    const listRole = container.resolve(ListRoleService)

    const { roles, totalCount } = await listRole.execute({
      page: Number(page),
      per_page: Number(per_page),
      search: {
        name: String(name),
        description: String(description)
      }
    })

    res.header('X-Total-Count', String(totalCount))
    res.header('X-Total-Page', String(Math.ceil(totalCount / Number(per_page))))

    return res.status(200).json(classToClass(roles))
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const showRoleService = container.resolve(ShowRoleService)

    const role = await showRoleService.execute(id)

    return res.status(200).json(classToClass(role))
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, description, permissions } = req.body

    const createRole = container.resolve(CreateRoleService)

    const role = await createRole.execute({
      name,
      description,
      permissions_ids: permissions
    })

    return res.status(201).json(classToClass(role))
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { name, description, permissions } = req.body

    const updateRole = container.resolve(UpdateRoleService)

    const role = await updateRole.execute({
      id,
      name,
      description,
      permissions_ids: permissions
    })

    return res.status(201).json(classToClass(role))
  }
}

export default RolesController
