import WinstonProvider from './implementations/logger/WinstonProvider'
import NodemailerProvider from './implementations/mail/NodemailerProvider'
import BullProvider from './implementations/queue/BullProvider'
import DiskProvider from './implementations/storage/DiskProvider'
import HandlebarsProvider from './implementations/template/HandlebarsProvider'

const providers = {
  mail: {
    nodemailer: NodemailerProvider
  },
  logger: {
    winston: WinstonProvider
  },
  queue: {
    bull: BullProvider
  },
  upload: {
    disk: DiskProvider
  },
  template: {
    handlebars: HandlebarsProvider
  }
}

export default providers
