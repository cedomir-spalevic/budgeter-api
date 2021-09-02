import { graphqlAdminAuth } from "middleware/auth";
import {
   AdminUserRequest,
   BudgeterRequestAuth,
   GetListQueryStringParameters
} from "models/requests";
import { AdminPublicUser } from "models/schemas/user";
import { ObjectId } from "mongodb";
import {
   createUser,
   deleteUser,
   getUserById,
   getUsers,
   updateUser
} from "./processor";

// Admin access only
const resolvers = {
   users: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<AdminPublicUser[]> => {
      await graphqlAdminAuth(context);
      const queryStringParameters: GetListQueryStringParameters = {
         skip: args["skip"] as number,
         limit: args["limit"] as number
      };
      return getUsers(queryStringParameters);
   },
   userById: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<AdminPublicUser> => {
      await graphqlAdminAuth(context);
      const userId = args["userId"] as string;
      return getUserById(new ObjectId(userId));
   },
   createUser: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<AdminPublicUser> => {
      await graphqlAdminAuth(context);
      const input = args["user"] as Record<string, unknown>;
      const request: AdminUserRequest = {
         userId: new ObjectId(input["id"] as string),
         firstName: input["firstName"] as string,
         lastName: input["lastName"] as string,
         email: input["email"] as string | null,
         phoneNumber: input["phoneNumber"] as string | null,
         isAdmin: input["isAdmin"] as boolean,
         password: input["password"] as string
      };
      return createUser(request);
   },
   updateUser: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<AdminPublicUser> => {
      await graphqlAdminAuth(context);
      const userId = args["userId"] as string;
      const input = args["user"] as Record<string, unknown>;
      const request: AdminUserRequest = {
         userId: new ObjectId(input["id"] as string),
         firstName: input["firstName"] as string,
         lastName: input["lastName"] as string,
         email: input["email"] as string | null,
         phoneNumber: input["phoneNumber"] as string | null,
         isAdmin: input["isAdmin"] as boolean,
         password: input["password"] as string
      };
      return updateUser(new ObjectId(userId), request);
   },
   deleteUser: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<ObjectId> => {
      await graphqlAdminAuth(context);
      const userId = args["userId"] as string;
      return deleteUser(new ObjectId(userId));
   }
};

export default resolvers;
