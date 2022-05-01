import { NodeOptions } from '@sentry/node'
import { SENTRY_DSN } from '@shared/utils/environment'

type SentryConfig = NodeOptions

export default {
  dsn: SENTRY_DSN
} as SentryConfig
