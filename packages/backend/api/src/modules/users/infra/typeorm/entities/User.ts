import Card from '@modules/cards/infra/typeorm/entities/Card'
import Contact from '@modules/contacts/infra/typeorm/entities/Contact'
import CostCenter from '@modules/costCenters/infra/typeorm/entities/CostCenter'
import Role from '@modules/roles/infra/typeorm/entities/Role'
import { Exclude } from 'class-transformer'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'

export enum UserType {
  CHIEF = 'diretor',
  EMPLOYEE = 'funcionario',
  VISITOR = 'visitante',
  DRIVER = 'motorista',
  OUTSOURCED = 'terceirizado'
}

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column({ type: 'varchar', length: 11, unique: true })
  cpf: string

  @Column({ type: 'varchar', nullable: true })
  email: string

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  password: string

  @Column({ type: 'enum', enum: UserType })
  type: UserType

  @Column({ type: 'boolean', default: true })
  active: boolean

  @Column('varchar')
  company: string

  @Exclude()
  @CreateDateColumn()
  created_at: Date

  @Exclude()
  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => Card, card => card.user)
  cards: Card[]

  @ManyToOne(() => CostCenter, cost_center => cost_center.users, {
    nullable: false,
    cascade: true,
    eager: false
  })
  @JoinColumn({ name: 'cost_center_id' })
  cost_center: CostCenter

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'users_roles',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'role_id' }]
  })
  roles: Role[]

  @OneToOne(() => Contact, contact => contact.user)
  contact: Contact
}

export default User
