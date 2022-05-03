import conflictsRouter from '@modules/conflicts/infra/http/routes/conflicts.routes'
import healthCheckRouter from '@modules/healthcheck/infra/http/routes/healthcheck.routes'
import permissionsRouter from '@modules/permissions/infra/http/routes/permissions.routes'
import rolesRouter from '@modules/roles/infra/http/routes/roles.routes'
import initRouter from '@modules/users/infra/http/routes/init.routes'
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes'
import usersRouter from '@modules/users/infra/http/routes/users.routes'
import { Router } from 'express'

const routes = Router()

routes.use('/conflicts', conflictsRouter)
routes.use('/healthcheck', healthCheckRouter)
routes.use('/permissions', permissionsRouter)
routes.use('/roles', rolesRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/users', usersRouter)
routes.use('/init', initRouter)

export default routes
