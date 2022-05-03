import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config()

dotenv.config({
  path: path.resolve(__dirname, '..', '..', '..', '..', '..', '..', '.env')
})

export const { NODE_ENV } = process.env
export const { WEB_PORT } = process.env
export const { WEB_URL } = process.env
export const { DEBUG_PORT } = process.env
export const { API_PORT } = process.env
export const { API_SECRET } = process.env
export const { API_EXPIRES } = process.env
export const { PUBLIC_URL } = process.env
export const { TYPEORM_SYNC } = process.env
export const { TYPEORM_LOGGING } = process.env
export const { MYSQL_HOST } = process.env
export const { MYSQL_PORT } = process.env
export const { MYSQL_USER } = process.env
export const { MYSQL_PASS } = process.env
export const { MYSQL_DB } = process.env
export const { MYSQL_GUI_PORT } = process.env
export const { MSSQL_HOST } = process.env
export const { MSSQL_USER } = process.env
export const { MSSQL_PASS } = process.env
export const { MSSQL_DB } = process.env
export const { MSSQL_DEBUG } = process.env
