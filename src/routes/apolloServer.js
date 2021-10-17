import { gql, ApolloServer } from "apollo-server-express";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { getDriver } from "../services/neo4j/connection.js";

const typeDefs = gql`
   type Movie {
      title: String!
      year: Int
      plot: String
      actors: [Person] @relationship(type: "ACTED_IN", direction: IN)
   }

   type Person {
      name: String!
      movies: [Movie] @relationship(type: "ACTED_IN", direction: OUT)
   }
`;

export const setupRoutes = async (app) => {
   const driver = getDriver();
   const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

   const server = new ApolloServer({
      schema: neoSchema.schema
   });
   await server.start();

   server.applyMiddleware({ app });
};
