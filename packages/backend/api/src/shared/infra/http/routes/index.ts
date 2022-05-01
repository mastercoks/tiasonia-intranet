import conflictsRouter from '@modules/conflicts/infra/http/routes/conflicts.routes'
import healthCheckRouter from '@modules/healthcheck/infra/http/routes/healthcheck.routes'
import permissionsRouter from '@modules/permissions/infra/http/routes/permissions.routes'
import rolesRouter from '@modules/roles/infra/http/routes/roles.routes'
import companiesRouter from '@modules/users/infra/http/routes/companies.routes'
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes'
import usersRouter from '@modules/users/infra/http/routes/users.routes'
import { Router } from 'express'

const routes = Router()

routes.use('/conflicts', conflictsRouter)
routes.use('/healthcheck', healthCheckRouter)
routes.use('/permissions', permissionsRouter)
routes.use('/roles', rolesRouter)
routes.use('/companies', companiesRouter)
routes.use('/sessions', sessionsRouter)
routes.use('/users', usersRouter)

export default routes
