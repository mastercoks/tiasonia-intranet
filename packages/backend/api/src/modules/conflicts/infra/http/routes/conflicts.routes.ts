import { is } from '@shared/infra/http/middlewares/ensureAuthenticated'
import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

import ConflictsController from '../controllers/ConflictsController'

const conflictsRouter = Router()

const conflictsController = new ConflictsController()

conflictsRouter.head('/', is('SYNC_CONFLICT'), conflictsController.create)

conflictsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      per_page: Joi.number(),
      page: Joi.number()
    }
  }),
  is('LIST_CONFLICT'),
  conflictsController.list
)

export default conflictsRouter
