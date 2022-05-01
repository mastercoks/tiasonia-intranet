import ShowCardsService from '@modules/users/services/ShowCardsService'
import { classToClass } from 'class-transformer'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

class CardsController {
  public async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params

    const showCardsService = container.resolve(ShowCardsService)

    const user = await showCardsService.execute(id)

    return res.status(200).json(classToClass(user))
  }
}

export default CardsController
