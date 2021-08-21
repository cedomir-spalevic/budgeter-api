import { BudgeterRequest, middy } from "middleware/handler";
import { graphql } from "graphql";
import { resolvers } from "./resolvers";
import { auth } from "middleware/auth";
import test from "./test.graphql";
import test2 from "./test2.graphql";
import { makeExecutableSchema } from "@graphql-tools/schema";

const schema = makeExecutableSchema({ typeDefs: [test, test2] })

const graphqlTest = async (request: BudgeterRequest) => {
   const body = request.body;
   const query = body["query"] as string;
   return await graphql(schema, query, resolvers, request.auth);
};

export const handler = middy()
   .useAuth(auth)
   .useJsonBodyParser()
   .use(graphqlTest)
   .go();
