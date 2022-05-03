import {
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_PASS,
  MYSQL_PORT,
  MYSQL_USER,
  NODE_ENV,
  TYPEORM_LOGGING,
  TYPEORM_SYNC
} from '@shared/utils/environment'
import { LoggerOptions } from 'typeorm/logger/LoggerOptions'

interface MysqlConfig {
  host: string
  port: number
  username?: string
  password?: string
  database: string
  entities: string
  migrations: string
  synchronize?: boolean
  logging?: LoggerOptions
}

export default {
  host: MYSQL_HOST || 'localhost',
  port: Number(MYSQL_PORT) || 3306,
  username: MYSQL_USER,
  password: MYSQL_PASS,
  database: MYSQL_DB,
  entities:
    NODE_ENV === 'development'
      ? 'src/modules/**/infra/typeorm/entities/*.ts'
      : 'dist/modules/**/infra/typeorm/entities/*.js',
  migrations:
    NODE_ENV === 'development'
      ? 'src/shared/infra/typeorm/migrations/*.ts'
      : 'dist/shared/infra/typeorm/migrations/*.js',
  synchronize: Boolean(Number(TYPEORM_SYNC)),
  logging: TYPEORM_LOGGING || false
} as MysqlConfig
