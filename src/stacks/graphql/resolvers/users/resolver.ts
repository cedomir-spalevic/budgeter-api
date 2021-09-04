import { BudgeterRequestAuth } from "models/requests";
import { AdminPublicUser } from "models/schemas/user";
import { ObjectId } from "mongodb";
import { graphqlAdminAuth } from "stacks/graphql/utils/auth";
import {
   createUser,
   deleteUser,
   getUserById,
   getUsers,
   updateUser
} from "./processor";
import { validate as validateGet } from "../../utils/validators/get";
import { validate as validateCreate } from "./validators/create";
import { validate as validateUpdate } from "./validators/update";

// Admin access only
const resolvers = {
   users: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<AdminPublicUser[]> => {
      graphqlAdminAuth(context);
      const filters = validateGet(args);
      return getUsers(filters);
   },
   userById: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<AdminPublicUser> => {
      graphqlAdminAuth(context);
      const userId = args["userId"] as string;
      return getUserById(new ObjectId(userId));
   },
   createUser: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<AdminPublicUser> => {
      graphqlAdminAuth(context);
      const input = args["user"] as Record<string, unknown>;
      const request = validateCreate(input);
      return createUser(request);
   },
   updateUser: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<AdminPublicUser> => {
      graphqlAdminAuth(context);
      const userId = args["id"] as string;
      const input = args["user"] as Record<string, unknown>;
      const request = validateUpdate(input);
      return updateUser(new ObjectId(userId), request);
   },
   deleteUser: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<ObjectId> => {
      graphqlAdminAuth(context);
      const userId = args["id"] as string;
      return deleteUser(new ObjectId(userId));
   }
};

export default resolvers;
