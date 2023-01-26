import IListConflictExecutionDTO, {
  IResponse
} from '@modules/conflicts/dtos/IListConflictExecutionDTO'
import IConflictExecutionsRepository from '@modules/conflicts/repositories/IConflictExecutionsRepository'
import { getRepository, Repository } from 'typeorm'

import ConflictExecution, { UFs } from '../entities/ConflictExecution'

class ConflictExecutionsRepository implements IConflictExecutionsRepository {
  private ormRepository: Repository<ConflictExecution>

  constructor() {
    this.ormRepository = getRepository(ConflictExecution)
  }

  public async findById(id: string): Promise<ConflictExecution> {
    return await this.ormRepository.findOne(id)
  }

  public async search({
    page,
    per_page
  }: IListConflictExecutionDTO): Promise<IResponse> {
    const response = await this.ormRepository
      .createQueryBuilder('conflict_executions')
      .where('conflict_executions.running = 0')
      .andWhere('conflict_executions.url is not null')
      .orderBy('conflict_executions.updated_at', 'DESC')
      .skip(per_page * (page - 1))
      .take(per_page)
      .cache(true)
      .getManyAndCount()

    const executions = response[0]
    const totalCount = response[1]

    return { executions, totalCount }
  }

  public async findCurrent(): Promise<ConflictExecution> {
    return await this.ormRepository.findOne({ order: { updated_at: 'DESC' } })
  }

  public async create(uf: UFs): Promise<ConflictExecution> {
    const conflictExecution = this.ormRepository.create({ uf })
    return await this.ormRepository.save(conflictExecution)
  }

  public async save(
    conflictExecution: ConflictExecution
  ): Promise<ConflictExecution> {
    return await this.ormRepository.save(conflictExecution)
  }
}

export default ConflictExecutionsRepository
