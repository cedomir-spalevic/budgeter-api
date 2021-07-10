import { BudgeterRequest } from "middleware/handler";
import { validateStr } from "middleware/validators";
import { validateEmailOrPhoneNumber } from "middleware/validators/emailOrPhoneNumber";
import { LoginRequest } from "./type";

export const validate = (request: BudgeterRequest): LoginRequest => {
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
