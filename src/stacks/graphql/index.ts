import { BudgeterRequest, middy } from "middleware/handler/lambda";
import { graphql } from "graphql";
import { auth } from "middleware/auth";
import { UnauthorizedError } from "models/errors";
import schema from "./utils/schema";
import resolvers from "./utils/resolvers";

const executeGraphqlQuery = async (request: BudgeterRequest) => {
   const body = request.body;
   const query = body["query"] as string;
   const variables = body["variables"] as Record<string, unknown>;
   const executionResult = await graphql(schema, query, resolvers, request.auth, variables);
   if(executionResult.errors) {
      if(executionResult.errors.some(e => e.message === "Unauthorized")) {
         throw new UnauthorizedError();
      }
   }
   return executionResult;
};

export const handler = middy()
   .useAuth(auth)
   .useJsonBodyParser()
   .use(executeGraphqlQuery)
   .go();
