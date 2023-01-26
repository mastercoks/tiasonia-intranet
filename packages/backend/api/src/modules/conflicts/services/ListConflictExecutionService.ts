import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import IListConflictExecutionDTO from '../dtos/IListConflictExecutionDTO'
import ConflictExecution from '../infra/typeorm/entities/ConflictExecution'
import IConflictExecutionsRepository from '../repositories/IConflictExecutionsRepository'

interface Response {
  executions: ConflictExecution[]
  totalCount: number
}

@injectable()
class ListConflictExecutionService {
  constructor(
    @inject('ConflictExecutionsRepository')
    private conflictExecutionsRepository: IConflictExecutionsRepository
  ) {}

  public async execute({
    page = 1,
    per_page = 10
  }: IListConflictExecutionDTO): Promise<Response> {
    const {
      executions,
      totalCount
    } = await this.conflictExecutionsRepository.search({
      page,
      per_page
    })
    return { executions, totalCount }
  }
}

export default ListConflictExecutionService
