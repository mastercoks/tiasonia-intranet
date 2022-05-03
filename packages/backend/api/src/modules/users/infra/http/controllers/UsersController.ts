import CreateUserService from '@modules/users/services/CreateUserService'
import SearchUserService from '@modules/users/services/SearchUserService'
import ShowUserService from '@modules/users/services/ShowUserService'
import UpdateUserService from '@modules/users/services/UpdateUserService'
import { classToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, login, password, roles } = req.body

    const createUserService = container.resolve(CreateUserService)

    const users = await createUserService.execute({
      name,
      login,
      password,
      roles
    })

    return res.status(201).json(classToClass(users))
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const { page = 1, per_page = 10, name = '', login = '' } = req.query

    const searchUserService = container.resolve(SearchUserService)

    const { users, totalCount } = await searchUserService.execute({
      page: Number(page),
      per_page: Number(per_page),
      search: {
        name: String(name),
        login: String(login)
      }
    })

    res.header('X-Total-Count', String(totalCount))
    res.header('X-Total-Page', String(Math.ceil(totalCount / Number(per_page))))

    return res.status(200).json(classToClass(users))
  }

  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const showUserService = container.resolve(ShowUserService)

    const user = await showUserService.execute(id)

    return res.status(200).json(classToClass(user))
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params
    const { name, password, active, roles } = req.body

    const updateUserService = container.resolve(UpdateUserService)

    const user = await updateUserService.execute({
      id,
      name,
      password,
      active,
      roles
    })

    return res.status(200).json(classToClass(user))
  }
}

export default UsersController
