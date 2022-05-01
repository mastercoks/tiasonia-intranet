import { API_PORT } from '@shared/utils/environment'

import app from './app'
const port = API_PORT || 3333

app.listen(port, () => {
  console.log(`⚡️ Server listening on http://localhost:${port}`)
})
