import { graphqlAdminAuth } from "middleware/auth";
import { BudgeterRequestAuth } from "middleware/handler";
import { GetListQueryStringParameters } from "models/requests";
import { AdminPublicUser } from "models/schemas/user";
import { ObjectId } from "mongodb";
import { getUserById, getUsers } from "./processor";

// Admin access only
const resolvers = {
   users: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<AdminPublicUser[]> => {
      await graphqlAdminAuth(context);
      const queryStringParameters: GetListQueryStringParameters = {
         skip: args["skip"] as number,
         limit: args["limit"] as number
      }
      return getUsers(queryStringParameters);
   },
   userById: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<AdminPublicUser> => {
      await graphqlAdminAuth(context);
      const userId = args["userId"] as string;
      return getUserById(new ObjectId(userId));
   }
}

export default resolvers;