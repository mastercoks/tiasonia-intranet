import axios from 'axios'

import { REACT_APP_API_URL } from '../utils/environment'
import getErrorMessage from '../utils/getErrorMessage'

const api = axios.create({
  baseURL: REACT_APP_API_URL
})

api.interceptors.request.use(config => {
  let token = localStorage.getItem('@IntranetTeiu:token')

  if (config?.headers?.token) {
    token = config.headers.token
    delete config.headers.token
  }

  config.headers.authorization = `Bearer ${token}`

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

export default api
