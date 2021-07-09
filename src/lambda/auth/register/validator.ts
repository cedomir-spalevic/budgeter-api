import { validateStr } from "middleware/validators";
import { validateEmailOrPhoneNumber } from "middleware/validators/emailOrPhoneNumber";
import { GeneralError } from "models/errors";
import { BudgeterRequest } from "middleware/handler";

export interface RegisterBody {
   firstName: string;
   lastName: string;
   email?: string;
   phoneNumber?: string;
   password: string;
}

export const validate = (request: BudgeterRequest): RegisterBody => {
   const { body } = request;
   const firstName = validateStr(body, "firstName", true);
   const lastName = validateStr(body, "lastName", true);
   const emailInput = validateStr(body, "email");
   const phoneNumberInput = validateStr(body, "phoneNumber");
   const password = validateStr(body, "password", true);
   if (!password) throw new GeneralError("password is required");
   const { email, phoneNumber } = validateEmailOrPhoneNumber({
      email: emailInput,
      phoneNumber: phoneNumberInput
   });

   return {
      firstName,
      lastName,
      email,
      phoneNumber,
      password
   };
};
