import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config()

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '..', '..', '..', '..', '.env')
})

export const { NODE_ENV } = process.env
export const { PUPPETEER_PORT } = process.env
