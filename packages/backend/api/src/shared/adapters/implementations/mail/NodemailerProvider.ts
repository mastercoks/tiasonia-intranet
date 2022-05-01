import mailConfig from '@config/mail'
import ITemplateProvider from '@shared/adapters/models/ITemplateProvider'
import nodemailer, { Transporter } from 'nodemailer'

import IMailProvider, { IMessage } from '../../models/IMailProvider'

class NodemailerProvider implements IMailProvider {
  private transporter: Transporter
  private templateProvider: ITemplateProvider

  constructor(mailConfig: object, templateProvider: ITemplateProvider) {
    this.templateProvider = templateProvider
    this.transporter = nodemailer.createTransport(mailConfig)
  }

  public async sendEmail({
    to,
    from,
    subject,
    templateData,
    preview,
    attachments
  }: IMessage): Promise<void> {
    const message = await this.transporter.sendMail({
      from: {
        name: from?.name || mailConfig.name,
        address: from?.email || mailConfig.email
      },
      to: {
        name: to.name,
        address: to.email
      },
      subject,
      html: await this.templateProvider.parse(templateData),
      attachments
    })
    if (preview) {
      console.log('Message sent: %s', message.messageId)
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message))
    }
  }
}

export default NodemailerProvider
