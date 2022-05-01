import { is } from '@shared/infra/http/middlewares/ensureAuthenticated'
import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

import PermissionsController from '../controllers/PermissionsController'

const permissionsRouter = Router()

const permissionsController = new PermissionsController()

permissionsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string().trim().allow(''),
      description: Joi.string().trim().allow(''),
      per_page: Joi.number(),
      page: Joi.number()
    }
  }),
  is('LIST_PERMISSION'),
  permissionsController.list
)

permissionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required().uppercase().trim(),
      description: Joi.string().required().lowercase().trim()
    }
  }),
  is('CREATE_PERMISSION'),
  permissionsController.create
)

permissionsRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required()
    }
  }),
  is('SHOW_PERMISSION'),
  permissionsController.show
)

permissionsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required()
    },
    [Segments.BODY]: {
      name: Joi.string().required().uppercase().trim(),
      description: Joi.string().required().lowercase().trim()
    }
  }),
  is('UPDATE_PERMISSION'),
  permissionsController.update
)

export default permissionsRouter
