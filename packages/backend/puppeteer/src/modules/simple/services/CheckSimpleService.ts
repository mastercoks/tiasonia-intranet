import ICheckSimpleDTO from '@modules/simple/dtos/ICheckSimpleDTO'
import IResourceManagerRepository from '@modules/simple/repositories/IResourceManagerRepository'
import AppError from '@shared/errors/AppError'
import { inject, injectable } from 'tsyringe'

@injectable()
class CheckSimpleService {
  constructor(
    @inject('ResourceManagerRepository')
    private resourceManagerRepository: IResourceManagerRepository
  ) {}

  public async execute(cnpj: string): Promise<ICheckSimpleDTO> {
    try {
      await this.resourceManagerRepository.init()
      const page = await this.resourceManagerRepository.createPage(
        'https://consopt.www8.receita.fazenda.gov.br/consultaoptantes'
      )
      return this.resourceManagerRepository.isSimple(page, cnpj)
    } catch (error) {
      throw new AppError('Simple error', 400, 'simple_error')
    }
  }
}

export default CheckSimpleService
