import { Page } from 'puppeteer'

import ICheckSimpleDTO from '../dtos/ICheckSimpleDTO'

interface IResourceManagerRepository {
  init(): Promise<void>
  release(): Promise<void>
  createPage(url: string): Promise<Page>
  isSimple(page: Page, cnpj: string): Promise<ICheckSimpleDTO>
}

export default IResourceManagerRepository
