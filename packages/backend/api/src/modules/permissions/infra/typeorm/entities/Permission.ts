import Role from '@modules/roles/infra/typeorm/entities/Role'
import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('permissions')
class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true })
  name: string

  @Column('varchar')
  description: string

  @Exclude()
  @CreateDateColumn()
  created_at: Date

  @ManyToMany(() => Role, role => role.permissions)
  roles: Role[]
}

export default Permission
