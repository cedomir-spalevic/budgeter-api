import { BudgeterRequest } from "middleware/handler";
import { validateBool, validateStr } from "middleware/validators";
import { User } from "models/schemas/user";

export const validate = async (
   request: BudgeterRequest
): Promise<Partial<User>> => {
   const {
      auth: { userId },
      body
   } = request;
   const firstName = validateStr(body, "firstName", false);
   const lastName = validateStr(body, "lastName", false);
   const incomeNotifications = validateBool(body, "incomeNotifications", false);
   const paymentNotifications = validateBool(
      body,
      "paymentNotifications",
      false
   );

   return {
      _id: userId,
      firstName: firstName,
      lastName: lastName,
      notificationPreferences: {
         incomeNotifications,
         paymentNotifications
      }
   };
};
