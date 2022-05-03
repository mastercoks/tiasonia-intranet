import 'reflect-metadata'
import 'dotenv/config'
import 'express-async-errors'

import '@shared/adapters'
import '@shared/infra/typeorm'

import uploadConfig from '@config/upload'
import * as Sentry from '@sentry/node'
import { errors } from 'celebrate'
import cors from 'cors'
import express from 'express'
import path from 'path'

import errorHandler from './middlewares/errorHandler'
import routes from './routes'

const app = express()

app.set('trust proxy', 'loopback')
app.use(express.json())
app.use(
  cors({
    exposedHeaders: ['X-Total-Count', 'X-Total-Page']
  })
)
app.use(
  '/uploads',
  express.static(path.resolve(uploadConfig.tmpDir, 'uploads'))
)
app.use('/images', express.static(path.resolve(uploadConfig.tmpDir, 'images')))
app.use(
  '/spreadsheets',
  express.static(path.resolve(uploadConfig.tmpDir, 'spreadsheets'))
)
app.use(routes)
app.use(Sentry.Handlers.errorHandler())
app.use(errors())
app.use(errorHandler)

export default app
