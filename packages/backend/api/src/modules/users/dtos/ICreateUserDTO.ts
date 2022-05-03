import Role from '@modules/roles/infra/typeorm/entities/Role'

interface ICreateUserDTO {
  name: string
  login: string
  password: string
  roles?: Role[]
}

export default ICreateUserDTO
