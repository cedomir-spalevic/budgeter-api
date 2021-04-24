import { isStr } from "middleware/validators";
import { validateEmailOrPhoneNumber } from "middleware/validators/emailOrPhoneNumber";
import { Form } from "models/requests";

export interface LoginBody {
   email?: string;
   phoneNumber?: string;
   password: string;
}

export const validate = (form: Form): LoginBody => {
   const emailInput = isStr(form, "email");
   const phoneNumberInput = isStr(form, "phoneNumber");
   const password = isStr(form, "password", true);
   const { email, phoneNumber } = validateEmailOrPhoneNumber({
      email: emailInput,
      phoneNumber: phoneNumberInput
   });

   return { email, phoneNumber, password };
};
