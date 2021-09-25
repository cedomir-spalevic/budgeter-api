import { Validator } from "jsonschema";
import { User } from "models/schemas/user";
import schema from "./schema.json";

const validator = new Validator();

export const validate = (request: Record<string, unknown>): Partial<User> => {
   validator.validate(request, schema, { throwError: true });
   let notificationPreferences = undefined;
   if (request["notificationPreferences"]) {
      const notificationPreferencesInput = request[
         "notificationPreferences"
      ] as Record<string, unknown>;
      notificationPreferences = {
         incomeNotifications:
            (notificationPreferencesInput["incomeNotifications"] as boolean) ??
            undefined,
         paymentNotifications:
            (notificationPreferencesInput["paymentNotifications"] as boolean) ??
            undefined
      };
   }
   return {
      firstName: request["firstName"] as string,
      lastName: request["lastName"] as string,
      notificationPreferences
   };
};
