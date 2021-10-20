const { ApolloServer, gql } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const fs = require("fs");
const mongoose = require("mongoose");

require("dotenv").config();

const User = require('./models/User');
const Note = require('./models/Note');

async function startApolloServer(typeDefs, resolvers) {
  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {
      User,
      Note
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();
  server.applyMiddleware({ app });
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
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
