import { validateBool, validateStr } from "middleware/validators";
import { validateEmailOrPhoneNumber } from "middleware/validators/emailOrPhoneNumber";
import { GeneralError } from "models/errors";
import { AdminUserRequest, Form } from "models/requests";

export const validate = (form: Form): AdminUserRequest => {
   const firstName = validateStr(form, "firstName", true);
   const lastName = validateStr(form, "lastName", true);
   const isAdmin = validateBool(form, "isAdmin", true);
   const password = validateStr(form, "password", true);
   if (!password) throw new GeneralError("password is required");
   const emailInput = validateStr(form, "email");
   const phoneNumberInput = validateStr(form, "phoneNumber");
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
