import { REDIS_URL, REDIS_PASS, REDIS_PORT } from '@shared/utils/environment'
import { RedisOptions } from 'ioredis'

type RedisConfig = RedisOptions

export default {
  host: REDIS_URL || '127.0.0.1',
  port: Number(REDIS_PORT) || 6379,
  password: REDIS_PASS
} as RedisConfig
