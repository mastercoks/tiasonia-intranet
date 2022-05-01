import ICostCentersRepository from '@modules/costCenters/repositories/ICostCentersRepository'
import { inject, injectable } from 'tsyringe'

import User, { UserType } from '../infra/typeorm/entities/User'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'

export interface IRequest {
  name: string
  cpf: string
  email: string
  type: UserType
  password: string
  company: string
  cost_center: string
}

@injectable()
class CreateOrUpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('CostCentersRepository')
    private costCentersRepository: ICostCentersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  public async execute({
    name,
    cpf,
    email,
    type,
    password,
    company,
    cost_center
  }: IRequest): Promise<User> {
    const costCenter = await this.costCentersRepository.findOrCreate({
      name: cost_center
    })

    let user = await this.usersRepository.findByCpf(cpf)

    if (!user) {
      const passwordHash = await this.hashProvider.generateHash(password)

      user = await this.usersRepository.create({
        name,
        cpf,
        email,
        password: passwordHash,
        type,
        company,
        cost_center: costCenter
      })
    } else {
      user.name = name
      user.email = email
      user.company = company
      user.type = type
      user.cost_center = costCenter
      if (password) {
        const passwordMatched = await this.hashProvider.compareHash(
          password,
          user.password
        )

        if (!passwordMatched) {
          const passwordHash = await this.hashProvider.generateHash(password)
          user.password = passwordHash
        }
      }
    }

    return this.usersRepository.save(user)
  }
}

export default CreateOrUpdateUserService
