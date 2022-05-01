import Permission from '@modules/permissions/infra/typeorm/entities/Permission'
import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity('roles')
class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', unique: true })
  name: string

  @Column('varchar')
  description: string

  @Exclude()
  @CreateDateColumn()
  created_at: Date

  @ManyToMany(() => Permission, permission => permission.roles, {
    eager: true
  })
  @JoinTable({
    name: 'permissions_roles',
    joinColumns: [{ name: 'role_id' }],
    inverseJoinColumns: [{ name: 'permission_id' }]
  })
  permissions: Permission[]
}

export default Role
