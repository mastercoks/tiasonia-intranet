import CheckSimpleService from '@modules/simple/services/CheckSimpleService'
import { classToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class SimpleController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { cnpj } = req.params

    const checkSimpleService = container.resolve(CheckSimpleService)

    const simple = await checkSimpleService.execute(cnpj)

    return res.status(200).json(classToClass(simple))
  }
}

export default SimpleController
