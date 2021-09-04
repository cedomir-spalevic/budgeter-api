import { Validator } from "jsonschema";
import { User } from "models/schemas/user";
import schema from "./schema.json";

const validator = new Validator();

export const validate = (request: Record<string, unknown>): Partial<User> => {
   validator.validate(request, schema, { throwError: true });
   const notificationPreferencesInput = request[
      "notificationPreferences"
   ] as Record<string, unknown>;
   return {
      firstName: request["firstName"] as string,
      lastName: request["lastName"] as string,
      notificationPreferences: {
         incomeNotifications: notificationPreferencesInput[
            "incomeNotifications"
         ] as boolean,
         paymentNotifications: notificationPreferencesInput[
            "paymentNotifications"
         ] as boolean
      }
   };
};
