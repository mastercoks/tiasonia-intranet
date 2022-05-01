import { Router } from 'express'

import HealthCheckController from '../controllers/HealthCheckController'

const healthCheckRouter = Router()

const healthCheckController = new HealthCheckController()

healthCheckRouter.get('/', healthCheckController.show)

export default healthCheckRouter
