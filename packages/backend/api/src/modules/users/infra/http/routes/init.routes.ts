import { Router } from 'express'

import InitController from '../controllers/InitController'

const initRouter = Router()
const initController = new InitController()

initRouter.get('/', initController.create)

export default initRouter
