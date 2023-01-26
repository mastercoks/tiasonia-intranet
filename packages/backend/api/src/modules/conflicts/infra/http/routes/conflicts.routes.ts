import { is } from '@shared/infra/http/middlewares/ensureAuthenticated'
import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

import { UFs } from '../../typeorm/entities/ConflictExecution'
import ConflictsController from '../controllers/ConflictsController'

const conflictsRouter = Router()

const conflictsController = new ConflictsController()

conflictsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      uf: Joi.string()
        .valid(...Object.values(UFs))
        .required()
    }
  }),
  is('SYNC_CONFLICT'),
  conflictsController.create
)

conflictsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      per_page: Joi.number(),
      page: Joi.number(),
      execution_id: Joi.string().uuid()
    }
  }),
  is('LIST_CONFLICT'),
  conflictsController.list
)

conflictsRouter.get(
  '/stop',
  is('STOP_SYNC_CONFLICT'),
  conflictsController.update
)

export default conflictsRouter
