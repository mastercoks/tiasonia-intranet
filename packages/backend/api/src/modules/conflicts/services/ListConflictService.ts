import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import IListConflictDTO from '../dtos/IListConflictDTO'
import ConflictExecution from '../infra/typeorm/entities/ConflictExecution'
import IConflictExecutionsRepository from '../repositories/IConflictExecutionsRepository'
import IConflictsRepository from '../repositories/IConflictsRepository'

interface Response {
  execution: ConflictExecution
  totalCount: number
}

@injectable()
class ListConflictService {
  constructor(
    @inject('ConflictsRepository')
    private conflictsRepository: IConflictsRepository,
    @inject('ConflictExecutionsRepository')
    private conflictExecutionsRepository: IConflictExecutionsRepository
  ) {}

  public async execute({
    page,
    per_page = 10
  }: IListConflictDTO): Promise<Response> {
    const execution = await this.conflictExecutionsRepository.findCurrent()

    if (!execution) {
      throw new AppError(
        'Conflict Execution not found',
        404,
        'conflict_execution_not_found'
      )
    }
    const {
      conflicts,
      totalCount
    } = await this.conflictsRepository.findByExecution({
      execution_id: execution.id,
      page,
      per_page
    })
    execution.conflicts = conflicts
    return { execution, totalCount }
  }
}

export default ListConflictService
