import 'reflect-metadata'
import 'dotenv/config'
import 'express-async-errors'

import '@shared/adapters'

import cors from 'cors'
import express from 'express'

import errorHandler from './middlewares/errorHandler'
import routes from './routes'

const app = express()

app.use(express.json())
app.use(cors())

app.use(routes)
app.use(errorHandler)

export default app
