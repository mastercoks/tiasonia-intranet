import mysqlConfig from '@config/mysql'
import sleep from '@shared/utils/sleep'
import { createConnection } from 'typeorm'

const connect = async () => {
  try {
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
  } catch (err) {
    console.error(
      'Error when trying to connect to the database, trying again in 1s'
    )
    await sleep(1000)
    connect()
  }
}

connect()
