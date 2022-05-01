import User from '../infra/typeorm/entities/User'

interface ISearchUserDTO {
  search: {
    number_card: string
    name: string
    cpf: string
    type: string
    company: string
    cost_center: string
  }
  page: number
  per_page?: number
}

export interface IResponse {
  users: User[]
  totalCount: number
}

export default ISearchUserDTO
