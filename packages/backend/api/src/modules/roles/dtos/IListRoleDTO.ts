import Role from '../infra/typeorm/entities/Role'

interface IListRoleDTO {
  search: {
    name: string
    description: string
  }
  page: number
  per_page?: number
}

export interface IResponse {
  roles: Role[]
  totalCount: number
}

export default IListRoleDTO
