import IListConflictExecutionDTO, {
  IResponse
} from '../dtos/IListConflictExecutionDTO'
import ConflictExecution, {
  UFs
} from '../infra/typeorm/entities/ConflictExecution'

interface IConflictExecutionsRepository {
  search(data: IListConflictExecutionDTO): Promise<IResponse>
  findCurrent(): Promise<ConflictExecution>
  findById(id: string): Promise<ConflictExecution>
  create(uf: UFs): Promise<ConflictExecution>
  save(conflictExecution: ConflictExecution): Promise<ConflictExecution>
}

export default IConflictExecutionsRepository
