import { isValidCNPJ } from '@modules/simple/utils'
import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

import SimpleController from '../controllers/SimpleController'

const simpleRouter = Router()
const simpleController = new SimpleController()

simpleRouter.get(
  '/:cnpj',
  celebrate({
    [Segments.PARAMS]: {
      cnpj: Joi.string()
        .custom((cnpj, helper) => {
          if (isValidCNPJ(cnpj)) return cnpj
          helper.message({ custom: 'CNPJ inválido' })
        }, 'invalid-cnpj')
        .required()
    }
  }),
  simpleController.index
)

export default simpleRouter
