import { IParseTemplate } from './ITemplateProvider'

interface IMailContent {
  name: string
  email: string
}

export interface IMessage {
  to: IMailContent
  from?: IMailContent
  subject: string
  templateData: IParseTemplate
  preview?: boolean
  attachments?: any
}

export default interface IMailProvider {
  sendEmail(message: IMessage): Promise<void>
}
