import simpleRouter from '@modules/simple/infra/http/routes/simple.routes'
import { Router } from 'express'

const routes = Router()

routes.use('/simple', simpleRouter)

export default routes
