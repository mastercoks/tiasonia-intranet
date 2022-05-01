import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import Conflict from './Conflict'

@Entity('conflict_executions')
class ConflictExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'boolean', default: true })
  running: boolean

  @Column({ type: 'varchar', nullable: true })
  url: string

  @Exclude()
  @CreateDateColumn()
  created_at: Date

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => Conflict, conflict => conflict.execution)
  conflicts: Conflict[]
}

export default ConflictExecution
