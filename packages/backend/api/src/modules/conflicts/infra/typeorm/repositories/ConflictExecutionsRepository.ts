import IConflictExecutionsRepository from '@modules/conflicts/repositories/IConflictExecutionsRepository'
import { getRepository, Repository } from 'typeorm'

import ConflictExecution from '../entities/ConflictExecution'

class ConflictExecutionsRepository implements IConflictExecutionsRepository {
  private ormRepository: Repository<ConflictExecution>

  constructor() {
    this.ormRepository = getRepository(ConflictExecution)
  }

  public async findCurrent(): Promise<ConflictExecution> {
    return await this.ormRepository.findOne({ order: { updated_at: 'DESC' } })
  }

  public async create(): Promise<ConflictExecution> {
    const conflictExecution = this.ormRepository.create()
    return await this.ormRepository.save(conflictExecution)
  }

  public async save(
    conflictExecution: ConflictExecution
  ): Promise<ConflictExecution> {
    return await this.ormRepository.save(conflictExecution)
  }
}

export default ConflictExecutionsRepository
