import ConflictExecution from '../infra/typeorm/entities/ConflictExecution'

interface IConflictExecutionsRepository {
  findCurrent(): Promise<ConflictExecution>
  create(): Promise<ConflictExecution>
  save(conflictExecution: ConflictExecution): Promise<ConflictExecution>
}

export default IConflictExecutionsRepository
