import ICreateUserDTO from '../dtos/ICreateUserDTO'
import ISearchUserDTO, { IResponse } from '../dtos/ISearchUserDTO'
import User from '../infra/typeorm/entities/User'

interface IUsersRepository {
  search(data: ISearchUserDTO): Promise<IResponse>
  findById(id: string): Promise<User | undefined>
  findByLogin(login: string): Promise<User | undefined>
  create(data: ICreateUserDTO): Promise<User>
  save(user: User): Promise<User>
}

export default IUsersRepository
