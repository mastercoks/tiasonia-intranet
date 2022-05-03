import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

import ConflictExecution from '../infra/typeorm/entities/ConflictExecution'
import IConflictExecutionsRepository from '../repositories/IConflictExecutionsRepository'

@injectable()
class StopConflictService {
  constructor(
    @inject('ConflictExecutionsRepository')
    private conflictExecutionsRepository: IConflictExecutionsRepository
  ) {}

  public async execute(): Promise<ConflictExecution> {
    const execution = await this.conflictExecutionsRepository.findCurrent()

    if (!execution)
      throw new AppError(
        'Conflict Execution not found',
        404,
        'conflict_execution_not_found'
      )

    if (!execution.running)
      throw new AppError(
        'Conflict Execution not running',
        406,
        'conflict_execution_not_running'
      )

    execution.running = false

    const stopExecution = await this.conflictExecutionsRepository.save(
      execution
    )

    return stopExecution
  }
}

export default StopConflictService
