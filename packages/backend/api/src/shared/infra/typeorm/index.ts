import mysqlConfig from '@config/mysql'
import sleep from '@shared/utils/sleep'
import { createConnection } from 'typeorm'

const connect = async () => {
  try {
    await sleep(4000)
    await createConnection({
      name: 'default',
      type: 'mysql',
      host: mysqlConfig.host,
      port: mysqlConfig.port,
      username: mysqlConfig.username,
      password: mysqlConfig.password,
      database: mysqlConfig.database,
      entities: [mysqlConfig.entities],
      migrations: [mysqlConfig.migrations],
      cli: {
        migrationsDir: './migrations'
      },
      synchronize: mysqlConfig.synchronize,
      logging: mysqlConfig.logging
    })
    console.log('Connected!')
  } catch (err: any) {
    console.error('error', 'Erro na sincronização dos conflitos', {
      action: '@shared/infra/typeorm/index',
      err,
      message: err.message,
      stack: err.stack?.split('\n')
    })
    await sleep(2000)
    connect()
  }
}

connect()
