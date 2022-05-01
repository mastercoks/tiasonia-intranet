import ICreateConflictDTO from '@modules/conflicts/dtos/ICreateConflictDTO'
import IListConflictDTO, {
  IResponse
} from '@modules/conflicts/dtos/IListConflictDTO'
import IConflictsRepository from '@modules/conflicts/repositories/IConflictsRepository'
import { getRepository, Repository } from 'typeorm'

import Conflict from '../entities/Conflict'

class ConflictsRepository implements IConflictsRepository {
  private ormRepository: Repository<Conflict>

  constructor() {
    this.ormRepository = getRepository(Conflict)
  }

  public async findByExecution({
    execution_id,
    page,
    per_page = 10
  }: IListConflictDTO): Promise<IResponse> {
    const response = await this.ormRepository
      .createQueryBuilder('conflicts')
      .where('conflicts.execution_id = :execution_id', { execution_id })
      .orderBy('conflicts.name', 'ASC')
      .skip(per_page * (page - 1))
      .take(per_page)
      .cache(true)
      .getManyAndCount()

    const conflicts = response[0]
    const totalCount = response[1]

    return { conflicts, totalCount }
  }

  public async create(data: ICreateConflictDTO): Promise<Conflict> {
    const conflict = this.ormRepository.create(data)
    return await this.ormRepository.save(conflict)
  }
}

export default ConflictsRepository
