import loggerConfig from '@config/logger'
import mailConfig from '@config/mail'
import queueConfig from '@config/queue'
import redisConfig from '@config/redis'
import uploadConfig from '@config/upload'
import CardsRepository from '@modules/cards/infra/typeorm/repositories/CardsRepository'
import ICardsRepository from '@modules/cards/repositories/ICardsRepository'
import CompaniesRepository from '@modules/companies/infra/typeorm/repositories/CompaniesRepository'
import ICompaniesRepository from '@modules/companies/repositories/ICompaniesRepository'
import ConflictExecutionsRepository from '@modules/conflicts/infra/typeorm/repositories/ConflictExecutionsRepository'
import ConflictsRepository from '@modules/conflicts/infra/typeorm/repositories/ConflictsRepository'
import IConflictExecutionsRepository from '@modules/conflicts/repositories/IConflictExecutionsRepository'
import IConflictsRepository from '@modules/conflicts/repositories/IConflictsRepository'
import ContactsRepository from '@modules/contacts/infra/typeorm/repositories/ContactsRepository'
import IContactsRepository from '@modules/contacts/repositories/IContactsRepository'
import CostCentersRepository from '@modules/costCenters/infra/typeorm/repositories/CostCentersRepository'
import ICostCentersRepository from '@modules/costCenters/repositories/ICostCentersRepository'
import DocumentsRepository from '@modules/envelopes/infra/typeorm/repositories/DocumentsRepository'
import EnvelopesRepository from '@modules/envelopes/infra/typeorm/repositories/EnvelopesRepository'
import IDocumentsRepository from '@modules/envelopes/repositories/IDocumentsRepository'
import IEnvelopesRepository from '@modules/envelopes/repositories/IEnvelopesRepository'
import PermissionsRepository from '@modules/permissions/infra/typeorm/repositories/PermissionsRepository'
import IPermissionsRepository from '@modules/permissions/repositories/IPermissionsRepository'
import ReadersRepository from '@modules/readers/infra/typeorm/repositories/ReadersRepository'
import ReaderTypesRepository from '@modules/readers/infra/typeorm/repositories/ReaderTypesRepository'
import IReadersRepository from '@modules/readers/repositories/IReadersRepository'
import IReaderTypesRepository from '@modules/readers/repositories/IReaderTypesRepository'
import RecipientsRepository from '@modules/recipients/infra/typeorm/repositories/RecipientsRepository'
import IRecipientsRepository from '@modules/recipients/repositories/IRecipientsRepository'
import RecordsRepository from '@modules/records/infra/typeorm/repositories/RecordsRepository'
import IRecordsRepository from '@modules/records/repositories/IRecordsRepository'
import RolesRepository from '@modules/roles/infra/typeorm/repositories/RolesRepository'
import IRolesRepository from '@modules/roles/repositories/IRolesRepository'
import SignaturesRepository from '@modules/signatures/infra/typeorm/repositories/SignaturesRepository'
import ISignaturesRepository from '@modules/signatures/repositories/ISignaturesRepository'
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import { container } from 'tsyringe'

import ILoggerProvider from './models/ILoggerProvider'
import IMailProvider from './models/IMailProvider'
import IQueueProvider from './models/IQueueProvider'
import IUploadProvider from './models/IUploadProvider'
import providers from './providers'

import '@modules/users/providers'

const Mail = providers.mail[mailConfig.driver]
const Template = providers.template[mailConfig.template]
const Queue = providers.queue[queueConfig.driver]
const Logger = providers.logger[loggerConfig.driver]
const Upload = providers.upload[uploadConfig.driver]

container.registerInstance<IMailProvider>(
  'MailProvider',
  new Mail(mailConfig.config[mailConfig.driver], new Template())
)

container.registerInstance<IQueueProvider>(
  'QueueProvider',
  new Queue({
    ...mailConfig.queue,
    redis: redisConfig
  })
)

container.registerInstance<ILoggerProvider>(
  'LoggerProvider',
  new Logger(loggerConfig.config[loggerConfig.driver])
)

container.registerInstance<IUploadProvider>('UploadProvider', new Upload())

container.registerSingleton<ICardsRepository>(
  'CardsRepository',
  CardsRepository
)

container.registerSingleton<IConflictsRepository>(
  'ConflictsRepository',
  ConflictsRepository
)

container.registerSingleton<IContactsRepository>(
  'ContactsRepository',
  ContactsRepository
)

container.registerSingleton<IConflictExecutionsRepository>(
  'ConflictExecutionsRepository',
  ConflictExecutionsRepository
)

container.registerSingleton<ICostCentersRepository>(
  'CostCentersRepository',
  CostCentersRepository
)

container.registerSingleton<IDocumentsRepository>(
  'DocumentsRepository',
  DocumentsRepository
)

container.registerSingleton<IEnvelopesRepository>(
  'EnvelopesRepository',
  EnvelopesRepository
)

container.registerSingleton<IPermissionsRepository>(
  'PermissionsRepository',
  PermissionsRepository
)

container.registerSingleton<IReadersRepository>(
  'ReadersRepository',
  ReadersRepository
)

container.registerSingleton<IReaderTypesRepository>(
  'ReaderTypesRepository',
  ReaderTypesRepository
)

container.registerSingleton<IRecipientsRepository>(
  'RecipientsRepository',
  RecipientsRepository
)

container.registerSingleton<IRecordsRepository>(
  'RecordsRepository',
  RecordsRepository
)

container.registerSingleton<IRolesRepository>(
  'RolesRepository',
  RolesRepository
)

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository
)

container.registerSingleton<ISignaturesRepository>(
  'SignaturesRepository',
  SignaturesRepository
)

container.registerSingleton<ICompaniesRepository>(
  'CompaniesRepository',
  CompaniesRepository
)
