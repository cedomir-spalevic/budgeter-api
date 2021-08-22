import { BudgeterRequest } from "middleware/handler";
import { validateBool, validateStr } from "middleware/validators";
import { validateEmailOrPhoneNumber } from "middleware/validators/emailOrPhoneNumber";
import { GeneralError } from "models/errors";
import { AdminUserRequest } from "models/requests";

export const validate = (request: BudgeterRequest): AdminUserRequest => {
   const { body } = request;
   const firstName = validateStr(body, "firstName", true);
   const lastName = validateStr(body, "lastName", true);
   const isAdmin = validateBool(body, "isAdmin", true);
   const password = validateStr(body, "password", true);
   if (!password) throw new GeneralError("password is required");
   const emailInput = validateStr(body, "email");
   const phoneNumberInput = validateStr(body, "phoneNumber");
   const { email, phoneNumber } = validateEmailOrPhoneNumber({
      email: emailInput,
      phoneNumber: phoneNumberInput
   });

   return {
      firstName,
      lastName,
      email,
      phoneNumber,
      isAdmin,
      password
   };
};
