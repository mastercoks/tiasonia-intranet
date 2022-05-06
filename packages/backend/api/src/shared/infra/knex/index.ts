import mssqlConfig from '@config/mssql'
import knex from 'knex'

const db = knex({
  client: 'mssql',
  connection: {
    host: mssqlConfig.host,
    port: mssqlConfig.port,
    user: mssqlConfig.user,
    password: mssqlConfig.password,
    database: mssqlConfig.database,
    options: {
      encrypt: false,
      enableArithAbort: true
    }
  },
  debug: mssqlConfig.debug
})

export default db
