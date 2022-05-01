import SearchCompanyService from '@modules/users/services/SearchCompanyService'
import { classToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class CompaniesController {
  public async list(req: Request, res: Response): Promise<Response> {
    const { company = '' } = req.query
    const searchCompanyService = container.resolve(SearchCompanyService)

    const companies = await searchCompanyService.execute({
      company: String(company)
    })

    return res.status(200).json(classToClass(companies))
  }
}

export default CompaniesController
