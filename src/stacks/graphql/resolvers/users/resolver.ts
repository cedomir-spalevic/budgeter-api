import { graphqlAdminAuth } from "middleware/auth";
import { BudgeterRequestAuth } from "middleware/handler";
import { AdminUserRequest, GetListQueryStringParameters } from "models/requests";
import { AdminPublicUser } from "models/schemas/user";
import { ObjectId } from "mongodb";
import { createUser, deleteUser, getUserById, getUsers, updateUser } from "./processor";

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
   },
   createUser: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<AdminPublicUser> => {
      await graphqlAdminAuth(context);
      const userInput = args["user"] as Record<string, unknown>;
      const request: AdminUserRequest = {
         userId: new ObjectId(userInput["id"] as string),
         firstName: userInput["firstName"] as string,
         lastName: userInput["lastName"] as string,
         email: userInput["email"] as string | null,
         phoneNumber: userInput["phoneNumber"] as string | null,
         isAdmin: userInput["isAdmin"] as boolean,
         password: userInput["password"] as string
      }
      return createUser(request);
   },
   deleteUser: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<ObjectId> => {
      await graphqlAdminAuth(context);
      const userId = args["userId"] as string;
      return deleteUser(new ObjectId(userId));
   },
   updateUser: async (args: Record<string, unknown>, context: BudgeterRequestAuth): Promise<AdminPublicUser> => {
      await graphqlAdminAuth(context);
      const userId = args["userId"] as string;
      const userInput = args["user"] as Record<string, unknown>;
      const request: AdminUserRequest = {
         userId: new ObjectId(userInput["id"] as string),
         firstName: userInput["firstName"] as string,
         lastName: userInput["lastName"] as string,
         email: userInput["email"] as string | null,
         phoneNumber: userInput["phoneNumber"] as string | null,
         isAdmin: userInput["isAdmin"] as boolean,
         password: userInput["password"] as string
      }
      return updateUser(new ObjectId(userId), request);
   }
}

export default resolvers;