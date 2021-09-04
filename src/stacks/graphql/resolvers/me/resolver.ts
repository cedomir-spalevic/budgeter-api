import { BudgeterRequestAuth } from "models/requests";
import { PublicUser, User } from "models/schemas/user";
import UsersProcessor from "./processor";
import { validate } from "./validators";

const resolvers = {
   me: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicUser> => {
      const usersProcessor = await UsersProcessor.getInstance(context.userId);
      return usersProcessor.get();
   },
   updateMe: async (
      args: Record<string, unknown>,
      context: BudgeterRequestAuth
   ): Promise<PublicUser> => {
      const meInput = args["me"] as Record<string, unknown>;
      const input = validate(meInput);
      const usersProcessor = await UsersProcessor.getInstance(context.userId);
      return await usersProcessor.update(input);
   }
};

export default resolvers;
