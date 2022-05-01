import {
  MAIL_DRIVER,
  MAIL_TEMPLATE,
  MAIL_NAME,
  MAIL_PASS,
  MAIL_USER,
  MAIL_SERVICE
} from '@shared/utils/environment'
import { QueueOptions } from 'bull'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

interface MailConfig {
  driver: 'nodemailer'
  template: 'handlebars'
  name: string
  email: string
  queue: QueueOptions
  config: {
    nodemailer: SMTPTransport.Options
  }
}

export default {
  driver: MAIL_DRIVER || 'nodemailer',
  template: MAIL_TEMPLATE || 'handlebars',
  name: MAIL_NAME,
  email: MAIL_USER,
  queue: {
    defaultJobOptions: {
      removeOnComplete: true,
      attempts: 5,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    },
    limiter: {
      max: 150,
      duration: 1000
    }
  },
  config: {
    nodemailer: {
      service: MAIL_SERVICE,
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS
      },
      from: MAIL_USER
    }
  }
} as MailConfig
