const { makeExecutableSchema } = require('@graphql-tools/schema');
const resolvers = require("./resolvers");
const typeDefs = require('./typeDefs');

module.exports = makeExecutableSchema({ typeDefs, resolvers, })