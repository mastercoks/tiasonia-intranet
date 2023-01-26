import ConflictExecution from '../infra/typeorm/entities/ConflictExecution'

interface IListConflictExecutionDTO {
  page: number
  per_page?: number
}

export interface IResponse {
  executions: ConflictExecution[]
  totalCount: number
}

export default IListConflictExecutionDTO
