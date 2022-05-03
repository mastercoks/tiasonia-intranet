import User from '../infra/typeorm/entities/User'

interface ISearchUserDTO {
  search: {
    name: string
    login: string
  }
  page: number
  per_page?: number
}

export interface IResponse {
  users: User[]
  totalCount: number
}

export default ISearchUserDTO
