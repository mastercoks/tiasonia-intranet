import { is } from '@shared/infra/http/middlewares/ensureAuthenticated'
import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

import UsersController from '../controllers/UsersController'

const usersRouter = Router()

const usersController = new UsersController()

usersRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      name: Joi.string().trim(),
      login: Joi.string().trim(),
      per_page: Joi.number(),
      page: Joi.number()
    }
  }),
  is('LIST_USER'),
  usersController.list
)

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required().lowercase().trim(),
      login: Joi.string().required().trim(),
      active: Joi.boolean().invalid(false),
      password: Joi.string().required(),
      roles: Joi.array()
    }
  }),
  is('CREATE_USER'),
  usersController.create
)

usersRouter.get(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required()
    }
  }),
  is('SHOW_USER'),
  usersController.show
)

usersRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required()
    },
    [Segments.BODY]: {
      name: Joi.string().lowercase().trim(),
      password: Joi.string(),
      active: Joi.boolean(),
      roles: Joi.array()
    }
  }),
  is('UPDATE_USER'),
  usersController.update
)

export default usersRouter
