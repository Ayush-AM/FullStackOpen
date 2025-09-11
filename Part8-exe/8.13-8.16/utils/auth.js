const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const auth = (context) => {
  const authHeader = context.req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      return decodedToken;
    } catch (error) {
      throw new GraphQLError('Invalid token', {
        extensions: {
          code: 'BAD_USER_INPUT',
        }
      });
    }
  }
  
  return null;
};

module.exports = { auth };