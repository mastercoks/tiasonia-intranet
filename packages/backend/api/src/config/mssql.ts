import {
  MSSQL_DB,
  MSSQL_DEBUG,
  MSSQL_HOST,
  MSSQL_PASS,
  MSSQL_USER
} from '@shared/utils/environment'

interface MssqlConfig {
  host: string
  user?: string
  password?: string
  database: string
  debug?: boolean
}

export default {
  host: MSSQL_HOST,
  user: MSSQL_USER,
  password: MSSQL_PASS,
  database: MSSQL_DB,
  debug: !!MSSQL_DEBUG
} as MssqlConfig
