import { gql, ApolloServer } from "apollo-server-express";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { getDriver } from "../services/neo4j/connection.js";
import { loadFiles } from "../utils/graphql.js";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import {
   DateTimeTypeDefinition,
   ObjectIDTypeDefinition
} from "graphql-scalars";
import path from "path";

export const setupRoutes = async (app) => {
   const typesArray = await loadFiles(path.join(__dirname, "schemas"), { extensions: ["gql"] });
   typesArray.push(
      DateTimeTypeDefinition,
      ObjectIDTypeDefinition
   );

   const typeDefs = mergeTypeDefs(typesArray);

   const resolversArray = await loadFiles(path.join(__dirname, "controllers", "graphql"), { extensions: ["js"] });
   const resolvers = mergeResolvers(resolversArray);
   
   const server = new ApolloServer({ typeDefs, resolvers, context: ({ req }) => ({ req }) });
   await server.start();

   server.applyMiddleware({ app });
};
