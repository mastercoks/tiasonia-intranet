import fs from 'fs'
import handlebars from 'handlebars'

import ITemplateProvider, {
  IParseTemplate
} from '../../models/ITemplateProvider'

class HandlebarsProvider implements ITemplateProvider {
  public async parse({ file, variables }: IParseTemplate): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8'
    })
    const parseTemplate = handlebars.compile(templateFileContent)

    return parseTemplate(variables)
  }
}

export default HandlebarsProvider
