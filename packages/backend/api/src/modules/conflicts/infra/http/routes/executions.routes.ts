import { is } from '@shared/infra/http/middlewares/ensureAuthenticated'
import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

import ConflictExecutionsController from '../controllers/ConflictExecutionsController'

const executionsRouter = Router()

const executionsController = new ConflictExecutionsController()

executionsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      per_page: Joi.number(),
      page: Joi.number()
    }
  }),
  is('LIST_EXECUTIONS'),
  executionsController.list
)

export default executionsRouter
