import ConflictExecution from '../infra/typeorm/entities/ConflictExecution'

interface ICreateConflictDTO {
  code: string
  name: string
  cnpj: string
  simple_national: boolean
  execution: ConflictExecution
}

export default ICreateConflictDTO
