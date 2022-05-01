import { is } from '@shared/infra/http/middlewares/ensureAuthenticated'
import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

import CompaniesController from '../controllers/CompaniesController'

const companiesRouter = Router()

const companiesController = new CompaniesController()

companiesRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      company: Joi.string().trim().allow('')
    }
  }),
  is('LIST_COMPANY'),
  companiesController.list
)

export default companiesRouter
