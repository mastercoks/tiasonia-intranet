import Role from '@modules/roles/infra/typeorm/entities/Role'
import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column({ type: 'varchar', unique: true })
  login: string

  @Exclude()
  @Column({ type: 'varchar' })
  password: string

  @Column({ type: 'boolean', default: true })
  active: boolean

  @Exclude()
  @CreateDateColumn()
  created_at: Date

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'users_roles',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'role_id' }]
  })
  roles: Role[]
}

export default User
