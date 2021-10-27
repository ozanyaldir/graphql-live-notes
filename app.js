
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

// GraphQL
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { PubSub } = require('graphql-subscriptions');

require("dotenv").config();

const schema = require('./graphql/schema.js')
const pubsub = new PubSub();
const graphQLServerPort = process.env.GRAPHQL_SERVER_PORT

// Mongoose models
const User = require('./models/User');
const Note = require('./models/Note');

async function startApolloServer(schema) {
  const app = express();
  app.use(async (req, res, next) => {
    const token = req.headers['authorization'];
    if (token && token !== 'null') {
      try {
        req.jwtPayload = await jwt.verify(token, process.env.JWT_SECRET)
      } catch (error) {
        console.log(`Auth token error: ${error}`);
      }
    }
    next();
  })


  const httpServer = http.createServer(app);
  const subscriptionServer = SubscriptionServer.create({
    schema,
    async onConnect(connectionParams, webSocket, context) {
      var ctx = {
        User,
        Note,
        pubsub
      }
      if (connectionParams.authorization) {
        const currentUser = await User.findOne({ username: connectionParams.authorization.username })
        console.log(currentUser)
        // const currentUser = await findUser(connectionParams.authorization);
        ctx['currentUser'] = currentUser;
      }
      // throw new Error('Missing auth token!');
      return ctx;
    },
    execute,
    subscribe,
  }, {
    server: httpServer,
    path: httpServer.graphqlPath,
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      User,
      Note,
      jwtPayload: req.jwtPayload,
      pubsub
    }),
    introspection: true,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          };
        }
      }
    ],
  });


  await server.start();
  server.applyMiddleware({ app });
  await new Promise((resolve) => httpServer.listen({ port: graphQLServerPort }, resolve));
  console.log(`🚀 Server ready at http://localhost:${graphQLServerPort}${server.graphqlPath}`);
}


mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.log(err.message)
  })
startApolloServer(schema);
