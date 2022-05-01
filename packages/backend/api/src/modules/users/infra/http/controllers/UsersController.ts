import CreateOrUpdateUserService, {
  IRequest
} from '@modules/users/services/CreateOrUpdateUserService'
import CreateUserService from '@modules/users/services/CreateUserService'
import SearchUserService from '@modules/users/services/SearchUserService'
import ShowUserService from '@modules/users/services/ShowUserService'
import UpdateUserService from '@modules/users/services/UpdateUserService'
import db from '@shared/infra/knex'
import getEmployees from '@shared/infra/knex/queries/getEmployees'
import { classToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class UsersController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      cpf,
      email,
      password,
      type,
      company,
      cost_center,
      roles
    } = req.body

    const createUserService = container.resolve(CreateUserService)

    const users = await createUserService.execute({
      name,
      cpf,
      email,
      password,
      type,
      company,
      cost_center_id: cost_center,
      roles
    })

    return res.status(201).json(classToClass(users))
  }

  public async list(req: Request, res: Response): Promise<Response> {
    const {
      page = 1,
      per_page = 10,
      number_card = '',
      name = '',
      cpf = '',
      type = '',
      company = '',
      cost_center = ''
    } = req.query

    const searchUserService = container.resolve(SearchUserService)

    const { users, totalCount } = await searchUserService.execute({
      page: Number(page),
      per_page: Number(per_page),
      search: {
        number_card: String(number_card),
        name: String(name),
        cpf: String(cpf),
        type: String(type),
        company: String(company),
        cost_center: String(cost_center)
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
    const {
      name,
      email,
      type,
      password,
      active,
      company,
      cost_center,
      roles
    } = req.body

    const updateUserService = container.resolve(UpdateUserService)

    const user = await updateUserService.execute({
      id,
      name,
      email,
      type,
      password,
      active,
      company,
      cost_center,
      roles
    })

    return res.status(200).json(classToClass(user))
  }

  public async import(req: Request, res: Response): Promise<Response> {
    const createOrUpdateUserService = container.resolve(
      CreateOrUpdateUserService
    )

    const users = await db.raw<IRequest[]>(getEmployees)

    for (const key in users) {
      await createOrUpdateUserService.execute(users[key])
    }

    return res.status(204).send()
  }
}

export default UsersController
