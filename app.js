const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/auth')
const taskRoutes = require('./routes/tasks')

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// 404 Handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }))

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  
  const response = {
    message: 'Something went wrong'
  }

  if (process.env.NODE_ENV === 'development') {
    response.error = err.message
  }

  res.status(500).json(response)
})

module.exports = app