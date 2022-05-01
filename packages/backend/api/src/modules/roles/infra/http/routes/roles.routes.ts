import { is } from '@shared/infra/http/middlewares/ensureAuthenticated'
import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

import RolesController from '../controllers/RolesController'

const rolesRouter = Router()

const rolesController = new RolesController()

rolesRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string().trim().allow(''),
      description: Joi.string().trim().allow(''),
      per_page: Joi.number(),
      page: Joi.number()
    }
  }),
  is('LIST_ROLE'),
  rolesController.list
)

rolesRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required().uppercase().trim(),
      description: Joi.string().required().lowercase().trim(),
      permissions: Joi.array()
    }
  }),
  is('CREATE_ROLE'),
  rolesController.create
)

rolesRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required()
    }
  }),
  is('SHOW_ROLE'),
  rolesController.show
)

rolesRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required()
    },
    [Segments.BODY]: {
      name: Joi.string().required().uppercase().trim(),
      description: Joi.string().required().lowercase().trim(),
      permissions: Joi.array()
    }
  }),
  is('UPDATE_ROLE'),
  rolesController.update
)

export default rolesRouter
