const PORT = process.env.PORT || 3003

// For testing, we'll let the test setup handle the connection
// For development/production, use the environment variable
const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? 'mongodb://localhost:27017/test-db' // This will be overridden by MongoMemoryServer
  : process.env.MONGODB_URI || 'mongodb://localhost/bloglist'

module.exports = {
  PORT,
  MONGODB_URI
}