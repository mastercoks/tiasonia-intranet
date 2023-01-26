import loggerConfig from '@config/logger'
import ResourceManagerRepository from '@modules/simple/infra/puppeteer/ResourceManagerRepository'
import IResourceManagerRepository from '@modules/simple/repositories/IResourceManagerRepository'
import { container } from 'tsyringe'

import ILoggerProvider from './models/ILoggerProvider'
import providers from './providers'

const Logger = providers.logger[loggerConfig.driver]

container.registerInstance<ILoggerProvider>(
  'LoggerProvider',
  new Logger(loggerConfig.config[loggerConfig.driver])
)
container.registerSingleton<IResourceManagerRepository>(
  'ResourceManagerRepository',
  ResourceManagerRepository
)
