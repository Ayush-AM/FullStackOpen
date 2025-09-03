const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')

const app = express()

// Only connect to MongoDB if not in test environment
// (test environment uses MongoMemoryServer)
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(config.MONGODB_URI)
    .then(() => {
      logger.info('connected to MongoDB')
    })
    .catch((error) => {
      logger.error('error connecting to MongoDB:', error.message)
    })
}

app.use(express.json())
app.use('/api/blogs', blogsRouter)

module.exports = app