interface ITemplateVariables {
  [key: string]: string | number
}

export interface IParseTemplate {
  file: string
  variables: ITemplateVariables
}

export default interface ITemplateProvider {
  parse(data: IParseTemplate): Promise<string>
}
