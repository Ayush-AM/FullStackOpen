const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./schemas/schema');
const resolvers = require('./resolvers/index');
const { auth } = require('./utils/auth');
const { MONGODB_URI } = require('./utils/config');
const User = require('./models/User');

console.log('Connecting to MongoDB...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const decodedToken = auth({ req });
    
    let currentUser = null;
    if (decodedToken) {
      currentUser = await User.findById(decodedToken.id);
    }
    
    return { currentUser };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});