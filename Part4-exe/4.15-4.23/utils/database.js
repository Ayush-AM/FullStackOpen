const mongoose = require('mongoose')
const config = require('./config')
const logger = require('./logger')

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI)
    logger.info('Connected to MongoDB')
  } catch (error) {
    logger.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  }
}

module.exports = connectDB