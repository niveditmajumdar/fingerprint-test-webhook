require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname)))


// In-memory store for webhook events
const events = []

// Fingerprint webhook endpoint
app.post('/webhook', (req, res) => {
  const event = req.body
  console.log('Webhook received:', JSON.stringify(event, null, 2))

  events.unshift({
    receivedAt: new Date().toISOString(),
    ...event
  })
  if (events.length > 20) events.pop()

  res.status(200).json({ ok: true })
})

// Frontend polls this to get stored events
app.get('/events', (req, res) => {
  res.json(events)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Webhook server running on port ${PORT}`)
})