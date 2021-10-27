const { ApolloServer, gql } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

require("dotenv").config();

const graphQLServerPort = process.env.GRAPHQL_SERVER_PORT

const User = require('./models/User');
const Note = require('./models/Note');

async function startApolloServer(typeDefs, resolvers) {
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



  const schema = makeExecutableSchema({ typeDefs, resolvers, });
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
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // This `server` is the instance returned from `new ApolloServer`.
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
const resolvers = require("./graphql/resolvers");
const typeDefs = fs.readFileSync("./graphql/schema.graphql").toString("utf-8");
startApolloServer(typeDefs, resolvers);
