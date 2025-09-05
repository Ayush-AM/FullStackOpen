// validation-middleware.js
module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/anecdotes') {
    const { content } = req.body
    if (!content || content.length < 5) {
      return res.status(400).json({
        error: 'Anecdote content must be at least 5 characters long'
      })
    }
  }
  next()
}