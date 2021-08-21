import { BudgeterRequest, middy } from "middleware/handler";
import { graphql } from "graphql";
//import { resolvers } from "./resolvers";
import { auth } from "middleware/auth";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { DateTimeTypeDefinition } from "graphql-scalars";
import ApiKeyDefs from "./resolvers/apiKeys/apiKey.graphql";
import ApiKeyResolvers from "./resolvers/apiKeys/resolver";
import UserDefs from "./resolvers/users/user.graphql";
import UserResolvers from "./resolvers/users/resolver";
//import BudgetDefs from "./resolvers/budgets/budget.graphql";
import { UnauthorizedError } from "models/errors";

const schema = makeExecutableSchema({ 
   typeDefs: [
      DateTimeTypeDefinition,
      ApiKeyDefs,
      UserDefs
   ] 
})

const resolvers = {
   ...ApiKeyResolvers,
   ...UserResolvers
}

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
