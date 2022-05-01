import ICreateConflictDTO from '../dtos/ICreateConflictDTO'
import IListConflictDTO, { IResponse } from '../dtos/IListConflictDTO'
import Conflict from '../infra/typeorm/entities/Conflict'

interface IConflictsRepository {
  findByExecution(data: IListConflictDTO): Promise<IResponse>
  create(data: ICreateConflictDTO): Promise<Conflict>
}

export default IConflictsRepository
