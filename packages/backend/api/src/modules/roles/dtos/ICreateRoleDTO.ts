import Permission from '@modules/permissions/infra/typeorm/entities/Permission'

interface ICreateRoleDTO {
  name: string
  description: string
  permissions: Permission[]
}

export default ICreateRoleDTO
