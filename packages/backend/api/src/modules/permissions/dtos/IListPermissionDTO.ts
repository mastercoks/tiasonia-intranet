import Permission from '../infra/typeorm/entities/Permission'

interface IListPermissionDTO {
  search: {
    name: string
    description: string
  }
  page: number
  per_page?: number
}

export interface IResponse {
  permissions: Permission[]
  totalCount: number
}

export default IListPermissionDTO
