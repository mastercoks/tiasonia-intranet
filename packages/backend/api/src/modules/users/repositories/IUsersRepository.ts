import ICreateUserDTO from '../dtos/ICreateUserDTO'
import ISearchUserDTO, { IResponse } from '../dtos/ISearchUserDTO'
import User from '../infra/typeorm/entities/User'

interface IUsersRepository {
  search(data: ISearchUserDTO): Promise<IResponse>
  findById(id: string): Promise<User | undefined>
  getCardsById(id: string): Promise<User | undefined>
  findByCpf(cpf: string): Promise<User | undefined>
  findCards(id: string): Promise<User | undefined>
  findCompanies(company: string): Promise<User[]>
  create(data: ICreateUserDTO): Promise<User>
  save(user: User): Promise<User>
}

export default IUsersRepository
