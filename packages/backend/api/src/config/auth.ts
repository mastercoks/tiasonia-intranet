import { API_EXPIRES, API_SECRET } from '@shared/utils/environment'

export default {
  secret: API_SECRET || '',
  expiresIn: API_EXPIRES || '1d'
}
