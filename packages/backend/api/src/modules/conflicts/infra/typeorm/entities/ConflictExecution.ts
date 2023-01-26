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

export enum UFs {
  AC = 'AC',
  AL = 'AL',
  AP = 'AP',
  AM = 'AM',
  BA = 'BA',
  CE = 'CE',
  DF = 'DF',
  ES = 'ES',
  GO = 'GO',
  MA = 'MA',
  MT = 'MT',
  MS = 'MS',
  MG = 'MG',
  PA = 'PA',
  PB = 'PB',
  PR = 'PR',
  PE = 'PE',
  PI = 'PI',
  RJ = 'RJ',
  RN = 'RN',
  RS = 'RS',
  RO = 'RO',
  RR = 'RR',
  SC = 'SC',
  SP = 'SP',
  SE = 'SE',
  TO = 'TO'
}

@Entity('conflict_executions')
class ConflictExecution {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'enum', enum: UFs })
  uf: UFs

  @Column({ type: 'boolean', default: true })
  running: boolean

  @Column({ type: 'varchar', nullable: true })
  url: string

  @Exclude()
  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => Conflict, conflict => conflict.execution)
  conflicts: Conflict[]
}

export default ConflictExecution
