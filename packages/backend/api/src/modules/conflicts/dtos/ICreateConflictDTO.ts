import ConflictExecution from '../infra/typeorm/entities/ConflictExecution'

interface ICreateConflictDTO {
  code: string
  name: string
  cnpj: string
  code_salesman: string
  name_salesman: string
  code_coordinator: string
  name_coordinator: string
  protheus: boolean
  simple_national: boolean
  execution: ConflictExecution
}

export default ICreateConflictDTO
