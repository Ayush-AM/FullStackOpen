const PORT = process.env.PORT || 3003

const MONGODB_URI = process.env.NODE_ENV === 'test' 
  ? 'mongodb://localhost:27017/test-db'
  : process.env.MONGODB_URI || 'mongodb://localhost/bloglist'

module.exports = {
  PORT,
  MONGODB_URI
}