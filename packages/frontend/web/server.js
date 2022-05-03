require('dotenv/config');

const express = require('express')
const path = require('path')
const app = express()
const PORT = 8080

const root = path.join(__dirname, 'build')

app.use(express.static(root))

app.use(function(req, res, next) {
  next()
})

app.get('/health', (req, res) => {
  res.json({
    status: 'OK'
  })
})

app.get('/resource-status', (req, res) => {
  res.json({
    createdBy: 'Matheus Coqueiro',
    nodeVersion: process.env.NODE_VERSION || 'v14.16.0',
    applicationName: 'INTRANET FRONT V1',
    environment: process.env.NODE_ENV || ''
  })
})

app.get('/info', (req, res) => {
  res.json({
    path: root
  })
})

app.get('*', (req, res, next) => {
  res.sendFile('index.html', { root })
})

app.listen(
  PORT,
  () => console.log(`⚡️ Server listening on http://localhost:${PORT}`)
)
