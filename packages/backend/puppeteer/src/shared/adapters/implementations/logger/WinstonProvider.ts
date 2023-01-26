import { createLogger, LoggerOptions, Logger } from 'winston'

import ILoggerProvider from '../../models/ILoggerProvider'

class WinstonProvider implements ILoggerProvider {
  private logger: Logger

  constructor(config: LoggerOptions) {
    this.logger = createLogger(config)
  }

  log(level: string, message: string, metadata: object): void {
    this.logger.log(level, message, { metadata })
  }
}

export default WinstonProvider
