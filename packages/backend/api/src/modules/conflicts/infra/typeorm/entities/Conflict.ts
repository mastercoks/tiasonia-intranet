import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

import ConflictExecution from './ConflictExecution'

@Entity('conflicts')
class Conflict {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 9 })
  code: string

  @Column('varchar')
  name: string

  @Column({ type: 'varchar', length: 14 })
  cnpj: string

  @Column({ type: 'varchar', length: 6 })
  code_salesman: string

  @Column('varchar')
  name_salesman: string

  @Column({ type: 'varchar', length: 6 })
  code_coordinator: string

  @Column('varchar')
  name_coordinator: string

  @Column('varchar')
  simple_national: boolean

  @Exclude()
  @CreateDateColumn()
  created_at: Date

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date

  @ManyToOne(() => ConflictExecution, execution => execution.conflicts, {
    nullable: false,
    cascade: true,
    eager: false
  })
  @JoinColumn({ name: 'execution_id' })
  execution: ConflictExecution
}

export default Conflict
