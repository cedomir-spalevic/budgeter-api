import { BudgeterRequestAuth } from "models/requests";
import { PublicUser, User } from "models/schemas/user";
import UsersProcessor from "./processor";

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
      const notificationPreferencesInput = meInput[
         "notificationPreferences"
      ] as Record<string, unknown>;
      const input: Partial<User> = {
         firstName: meInput["firstName"] as string,
         lastName: meInput["lastName"] as string,
         notificationPreferences: {
            incomeNotifications: notificationPreferencesInput[
               "incomeNotifications"
            ] as boolean,
            paymentNotifications: notificationPreferencesInput[
               "paymentNotifications"
            ] as boolean
         }
      };
      const usersProcessor = await UsersProcessor.getInstance(context.userId);
      return await usersProcessor.update(input);
   }
};

export default resolvers;
