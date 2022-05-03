import axios from 'axios'

import { API_URL, getErrorMessage } from '../utils'

const api = axios.create({
  baseURL: API_URL
})

api.interceptors.request.use(config => {
  let token = String(localStorage.getItem('@Intranet:token'))

  if (config?.headers?.token) {
    token = String(config.headers.token)
    delete config.headers.token
  }
  if (config.headers) {
    config.headers.authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  config => config,
  error => {
    const { data } = error?.response

    if (data?.code === 'token_expired') {
      localStorage.clear()
      window.location.reload()
    }

    return Promise.reject(getErrorMessage(data?.code))
  }
)

export { api }
