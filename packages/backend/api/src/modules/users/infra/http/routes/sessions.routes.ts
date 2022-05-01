import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'

import SessionsController from '../controllers/SessionsController'

const sessionsRouter = Router()
const sessionsController = new SessionsController()

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      login: Joi.string().min(11).max(11).required(),
      password: Joi.string().required().uppercase()
    }
  }),
  sessionsController.create
)

export default sessionsRouter
