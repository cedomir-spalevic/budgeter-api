import { BudgeterRequest } from "middleware/handler";
import { validateStr } from "middleware/validators";
import { validateEmailOrPhoneNumber } from "middleware/validators/emailOrPhoneNumber";

export interface LoginBody {
   email?: string;
   phoneNumber?: string;
   password: string;
}

export const validate = (request: BudgeterRequest): LoginBody => {
   const { body } = request;
   const emailInput = validateStr(body, "email");
   const phoneNumberInput = validateStr(body, "phoneNumber");
   const password = validateStr(body, "password", true);
   const { email, phoneNumber } = validateEmailOrPhoneNumber({
      email: emailInput,
      phoneNumber: phoneNumberInput
   });

   return { email, phoneNumber, password };
};
