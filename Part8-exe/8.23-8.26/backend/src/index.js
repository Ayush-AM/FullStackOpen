const { ApolloServer } = require('apollo-server');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const mongoose = require('mongoose');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');
const { MONGODB_URI, JWT_SECRET } = require('./utils/config');

console.log('Connecting to MongoDB...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message);
  });

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      );
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
    
    return {};
  },
});

const httpServer = createServer(server);

httpServer.listen(4000, () => {
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  
  // Set up subscription server
  new SubscriptionServer({
    execute,
    subscribe,
    schema,
  }, {
    server: httpServer,
    path: '/graphql',
  });
});