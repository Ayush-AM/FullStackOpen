const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' })
  }

  try {
    const decodedToken = jwt.verify(request.token, config.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }

    request.user = await User.findById(decodedToken.id)
    next()
  } catch (error) {
    return response.status(401).json({ error: 'token invalid' })
  }
}

module.exports = userExtractor