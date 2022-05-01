import { is } from '@shared/infra/http/middlewares/ensureAuthenticated'
import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

import { UserType } from '../../typeorm/entities/User'
import CardsController from '../controllers/CardsController'
import UsersController from '../controllers/UsersController'

const usersRouter = Router()

const usersController = new UsersController()
const cardsController = new CardsController()

usersRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      number_card: Joi.string().trim(),
      name: Joi.string().trim(),
      cpf: Joi.string().trim(),
      type: Joi.string().trim(),
      cost_center: Joi.string().trim(),
      company: Joi.string().trim(),
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
      cpf: Joi.string()
        .regex(/^[0-9]{11}$/)
        .required(),
      email: Joi.string().email().lowercase().trim(),
      active: Joi.boolean().invalid(false),
      password: Joi.string().uppercase(),
      type: Joi.string()
        .valid(...Object.values(UserType))
        .required(),
      company: Joi.string().required().lowercase().trim(),
      cost_center: Joi.string().uuid({ version: 'uuidv4' }).required(),
      roles: Joi.array()
    }
  }),
  is('CREATE_USER'),
  usersController.create
)

usersRouter.head('/import', is('IMPORT_USER'), usersController.import)

usersRouter.get(
  '/:id/cards',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid({ version: 'uuidv4' }).required()
    }
  }),
  is('SHOW_USER_CARDS'),
  cardsController.show
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
      cpf: Joi.string().regex(/^[0-9]{11}$/),
      email: Joi.string().email().lowercase().trim(),
      password: Joi.string().uppercase(),
      type: Joi.string()
        .valid(...Object.values(UserType))
        .required(),
      active: Joi.boolean(),
      company: Joi.string().lowercase().trim(),
      cost_center: Joi.string().uuid({ version: 'uuidv4' }),
      roles: Joi.array()
    }
  }),
  is('UPDATE_USER'),
  usersController.update
)

export default usersRouter
