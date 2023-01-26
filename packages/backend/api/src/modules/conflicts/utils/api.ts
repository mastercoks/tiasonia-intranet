import { PUPPETEER_HOST, PUPPETEER_PORT } from '@shared/utils/environment'
import axios, { AxiosError } from 'axios'

interface Error {
  error: string
  message: string
}

const api = axios.create({
  baseURL: `http://${PUPPETEER_HOST}:${PUPPETEER_PORT}`
})

api.interceptors.response.use(
  config => config,
  (error: AxiosError<Error>) => {
    const { data } = error?.response

    return Promise.reject(data?.message)
  }
)

export { api }
