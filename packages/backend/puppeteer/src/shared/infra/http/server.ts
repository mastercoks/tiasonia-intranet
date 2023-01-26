import { PUPPETEER_PORT } from '@shared/utils/environment'

import app from './app'
const port = PUPPETEER_PORT || 3333

app.listen(port, () => {
  console.log(`⚡️ Server listening on http://localhost:${port}`)
})
