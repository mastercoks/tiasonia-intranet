import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

import SimpleController from '../controllers/SimpleController'

const simpleRouter = Router()
const simpleController = new SimpleController()

simpleRouter.get(
  '/:cnpj',
  celebrate({
    [Segments.PARAMS]: {
      cnpj: Joi.number().required()
    }
  }),
  simpleController.index
)

export default simpleRouter
