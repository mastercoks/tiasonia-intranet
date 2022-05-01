import CreatePermissionService from '@modules/permissions/services/CreatePermissionService'
import ListPermissionService from '@modules/permissions/services/ListPermissionService'
import ShowPermissionService from '@modules/permissions/services/ShowPermissionService'
import UpdatePermissionService from '@modules/permissions/services/UpdatePermissionService'
import { classToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class PermissionsController {
  public async list(req: Request, res: Response): Promise<Response> {
    const { page = 1, per_page = 10, name = '', description = '' } = req.query

    const listPermission = container.resolve(ListPermissionService)

    const { permissions, totalCount } = await listPermission.execute({
      page: Number(page),
      per_page: Number(per_page),
      search: {
        name: String(name),
        description: String(description)
      }
    })

    res.header('X-Total-Count', String(totalCount))
    res.header('X-Total-Page', String(Math.ceil(totalCount / Number(per_page))))

    return res.status(200).json(classToClass(permissions))
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const showPermissionService = container.resolve(ShowPermissionService)

    const permission = await showPermissionService.execute(id)

    return res.status(200).json(classToClass(permission))
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name, description } = req.body

    const createPermission = container.resolve(CreatePermissionService)

    const permission = await createPermission.execute({
      name,
      description
    })

    return res.status(201).json(classToClass(permission))
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { name, description } = req.body

    const updatePermission = container.resolve(UpdatePermissionService)

    const role = await updatePermission.execute({
      id,
      name,
      description
    })

    return res.status(201).json(classToClass(role))
  }
}

export default PermissionsController
