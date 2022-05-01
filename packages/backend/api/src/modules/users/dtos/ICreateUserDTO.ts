import CostCenter from '@modules/costCenters/infra/typeorm/entities/CostCenter'
import Role from '@modules/roles/infra/typeorm/entities/Role'

import { UserType } from '../infra/typeorm/entities/User'

interface ICreateUserDTO {
  name: string
  cpf: string
  email?: string
  password?: string
  type: UserType
  company: string
  cost_center: CostCenter
  roles?: Role[]
}

export default ICreateUserDTO
