import loggerConfig from '@config/logger'
import ConflictExecutionsRepository from '@modules/conflicts/infra/typeorm/repositories/ConflictExecutionsRepository'
import ConflictsRepository from '@modules/conflicts/infra/typeorm/repositories/ConflictsRepository'
import IConflictExecutionsRepository from '@modules/conflicts/repositories/IConflictExecutionsRepository'
import IConflictsRepository from '@modules/conflicts/repositories/IConflictsRepository'
import PermissionsRepository from '@modules/permissions/infra/typeorm/repositories/PermissionsRepository'
import IPermissionsRepository from '@modules/permissions/repositories/IPermissionsRepository'
import RolesRepository from '@modules/roles/infra/typeorm/repositories/RolesRepository'
import IRolesRepository from '@modules/roles/repositories/IRolesRepository'
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import { container } from 'tsyringe'

import ILoggerProvider from './models/ILoggerProvider'
import providers from './providers'

import '@modules/users/providers'

const Logger = providers.logger[loggerConfig.driver]

container.registerInstance<ILoggerProvider>(
  'LoggerProvider',
  new Logger(loggerConfig.config[loggerConfig.driver])
)
container.registerSingleton<IConflictsRepository>(
  'ConflictsRepository',
  ConflictsRepository
)

container.registerSingleton<IConflictExecutionsRepository>(
  'ConflictExecutionsRepository',
  ConflictExecutionsRepository
)

container.registerSingleton<IPermissionsRepository>(
  'PermissionsRepository',
  PermissionsRepository
)

container.registerSingleton<IRolesRepository>(
  'RolesRepository',
  RolesRepository
)

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
)
