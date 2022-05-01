import Conflict from '../infra/typeorm/entities/Conflict'

interface IListConflictDTO {
  execution_id: string
  page: number
  per_page?: number
}

export interface IResponse {
  conflicts: Conflict[]
  totalCount: number
}

export default IListConflictDTO
