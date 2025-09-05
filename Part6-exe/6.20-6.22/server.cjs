// server.cjs
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const PORT = 3001

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Add validation middleware directly
server.post('/anecdotes', (req, res, next) => {
  const { content } = req.body
  
  if (!content || content.length < 5) {
    return res.status(400).json({
      error: 'Anecdote content must be at least 5 characters long'
    })
  }
  
  next()
})

server.use(router)

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`)
  console.log(`Available at http://localhost:${PORT}`)
  console.log(`Anecdotes endpoint: http://localhost:${PORT}/anecdotes`)
})