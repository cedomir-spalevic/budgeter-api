const { ApolloServer } = require("apollo-server-express");
const { loadFiles } = require("utils/graphql");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const {
   DateTimeTypeDefinition,
   ObjectIDTypeDefinition
} = require("graphql-scalars");
const path = require("path");

const setupRoutes = async (app) => {
   const typesArray = await loadFiles(path.join("schemas"), {
      recursive: true,
      extensions: ["gql"]
   });
   typesArray.push(DateTimeTypeDefinition, ObjectIDTypeDefinition);
   const typeDefs = mergeTypeDefs(typesArray);

   const resolversArray = await loadFiles(path.join("controllers", "graphql"), {
      recursive: false,
      extensions: ["js"]
   });
   const resolvers = mergeResolvers(resolversArray);
   const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ({ req }) => ({ req })
   });
   await server.start();

   server.applyMiddleware({ app });
};

module.exports = {
   setupApolloServer: setupRoutes
};
